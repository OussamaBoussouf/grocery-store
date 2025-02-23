import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  Firestore,
  getDocs,
  query,
  serverTimestamp,
  where,
} from '@angular/fire/firestore';
import { ShoppingCartService } from './shopping-cart.service';
import { Router } from '@angular/router';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(
    private fireStore: Firestore,
    private cartService: ShoppingCartService,
    private router: Router
  ) {}

  async placeOrder(order: Order) {
    try {
      const docRef = await addDoc(collection(this.fireStore, 'orders'), {
        ...order,
      });
      this.cartService.clearCart();
      this.router.navigate(['/order-success', docRef.id]);
    } catch (error) {
      console.log(error);
    }
  }

  async get(userId: string) {
    try {
      const orders: Order[] = [];

      const q = query(
        collection(this.fireStore, 'orders'),
        where('userId', '==', userId)
      );

      (await getDocs(q)).docs.forEach((order) => {
        orders.push(order.data() as Order);
      });
      return orders;
    } catch (error) {
      throw new Error('Something went wrong we could not get the orders');
    }
  }

  async getAll() {
    try {
      const orders: Order[] = [];
      const q = query(collection(this.fireStore, 'orders'));
      (await getDocs(q)).docs.forEach((order) => {
        orders.push(order.data() as Order);
      });
      return orders;
    } catch (error) {
      throw new Error('Something went wrong we could not get all the orders');
    }
  }
}
