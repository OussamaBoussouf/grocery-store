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
import { AppUser } from '../models/app-user';

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

  removeCartId() {
    localStorage.removeItem('cartId');
    this.cartIdSubject.next(null);
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

  async linkOrCreate(userId: string) {
    try {
      const userDocRef = doc(this.fireStore, `users/${userId}`);
      const user = await getDoc(userDocRef);
      const userCartId = (user.data() as AppUser).cartId;

      //Add cartId to user who don't have one
      if (!userCartId) {
        const cartId = await this.getOrCreateCartId();
        await updateDoc(userDocRef, { cartId });
        return;
      }

      const guestCartId = localStorage.getItem('cartId');
      if (!guestCartId) {
        localStorage.setItem('cartId', userCartId);
        this.cartIdSubject.next(userCartId);
        return
      }

      //Link guest cart with the logged in user cart
      const { docs: guestCartDocs } = await getDocs(
        collection(this.fireStore, `shopping-carts/${guestCartId}/basket`)
      );
      const { docs: userCartDocs } = await getDocs(
        collection(this.fireStore, `shopping-carts/${userCartId}/basket`)
      );

      const userCartIds = userCartDocs.map((item) => item.id);

      for (let i = 0; i < guestCartDocs.length; i++) {
        const item = guestCartDocs[i];
        const product = doc(
          this.fireStore,
          `shopping-carts/${userCartId}/basket/${item.id}`
        );
        if (userCartIds.includes(item.id)) {
          await updateDoc(product, {
            quantity: increment((item.data() as ShoppingCartItem).quantity),
          });
        } else {
          await setDoc(product, item.data());
        }
      }

      this.deleteGuestCart();
      localStorage.setItem('cartId', userCartId);
      this.cartIdSubject.next(userCartId);
    } catch (error) {
      console.error(error);
    }
  }

  private async deleteGuestCart() {
    //delete basket content
    this.clearCart();
    //delete shopping-cart
    const cartId = await this.getOrCreateCartId();
    await deleteDoc(doc(this.fireStore, `shopping-carts/${cartId}`));
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
