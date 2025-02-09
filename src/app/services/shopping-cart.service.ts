import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  Firestore,
  getDoc,
  increment,
  onSnapshot,
  QuerySnapshot,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Product } from '../models/product';
import { ShoppingCart } from '../models/shopping-cart';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {

  constructor(private fireStore: Firestore) {}

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
        (productSnap.data() as ShoppingCart).quantity === 1
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

  private create() {
    return addDoc(collection(this.fireStore, 'shopping-carts'), {
      createdAt: new Date().getTime(),
    });
  }

  private async getOrCreateCartId() {
    let cartId = localStorage.getItem('cartId');
    if (cartId) return cartId;
    const response = await this.create();
    localStorage.setItem('cartId', response.id);
    return response.id;
  }

  async getCart(callback: (docs : QuerySnapshot<DocumentData, DocumentData>) => void) {
    const cartId = await this.getOrCreateCartId();
    return onSnapshot(
      collection(this.fireStore, `shopping-carts/${cartId}/basket`),
      (docs) => {
       callback(docs);
      }
    );
  }
}
