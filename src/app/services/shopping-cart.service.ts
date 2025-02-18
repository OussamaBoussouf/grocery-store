import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  getDocs,
  increment,
  onSnapshot,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Product } from '../models/product';
import { ShoppingCartItem } from '../models/shopping-cart-item';
import { BehaviorSubject, Observable } from 'rxjs';
import { ShoppingCart } from '../models/shopping-cart';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  private cartIdSubject = new BehaviorSubject<string | null>(null);
  cartId$: Observable<string | null> = this.cartIdSubject.asObservable();

  constructor(private fireStore: Firestore) {
    if (localStorage.getItem('cartId'))
      this.cartIdSubject.next(localStorage.getItem('cartId'));
  }

  async incrementQuantity(productId: string) {
    try {
      const cartId = await this.getOrCreateCartId();
      const productRef = doc(
        this.fireStore,
        `shopping-carts/${cartId}/basket/${productId}`
      );
      await updateDoc(productRef, { quantity: increment(1) });
    } catch (error) {
      throw new Error('Something went wrong we could not increase qunatity');
    }
  }

  async decrementQuantity(productId: string) {
    try {
      const cartId = await this.getOrCreateCartId();
      const productRef = doc(
        this.fireStore,
        `shopping-carts/${cartId}/basket/${productId}`
      );
      const productSnap = await getDoc(productRef);
      if (
        productSnap.exists() &&
        (productSnap.data() as ShoppingCartItem).quantity === 1
      ) {
        await deleteDoc(productRef);
      } else {
        await updateDoc(productRef, { quantity: increment(-1) });
      }
    } catch (error) {
      throw new Error('Something went wrong we could not decrease qunatity');
    }
  }

  async addToCart(product: Product) {
    try {
      const cartId = await this.getOrCreateCartId();
      await setDoc(
        doc(
          this.fireStore,
          `shopping-carts/${cartId}/basket/${product.productId}`
        ),
        { ...product, quantity: 1 }
      );
    } catch (error) {
      throw new Error('Something wont wrong while adding product');
    }
  }

  async clearCart() {
    const cartId = await this.getOrCreateCartId();
    const basketItemsDoc = await getDocs(
      collection(this.fireStore, `shopping-carts/${cartId}/basket`)
    );

    for (let i = 0; i < basketItemsDoc.docs.length; i++) {
      const item = basketItemsDoc.docs[i];
      await deleteDoc(
        doc(this.fireStore, `shopping-carts/${cartId}/basket`, item.id)
      );
    }
  }

  getCart(cartId: string | null): Observable<ShoppingCart> {
    return new Observable((subscribe) => {
      const unsubscribe = onSnapshot(
        collection(this.fireStore, `shopping-carts/${cartId}/basket`),
        (items) => {
          const data = items.docs.map(
            (item) => item.data() as ShoppingCartItem
          );
          subscribe.next(new ShoppingCart(data));
        }
      );
      return () => unsubscribe();
    });
  }

  private create() {
    return addDoc(collection(this.fireStore, 'shopping-carts'), {
      createdAt: new Date().getTime(),
    });
  }

  private async getOrCreateCartId() {
    let cartId = localStorage.getItem('cartId');
    if (cartId) return cartId;
    const response = await this.create();
    this.cartIdSubject.next(response.id);
    localStorage.setItem('cartId', response.id);
    return response.id;
  }
}
