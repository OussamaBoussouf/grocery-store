import { Component, Input } from '@angular/core';
import { AppUser } from '../models/app-user';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { Order } from '../models/order';
import { OrderService } from '../services/order.service';

import { ShoppingCart } from '../models/shopping-cart';

@Component({
  selector: 'app-shopping-form',
  templateUrl: './shopping-form.component.html',
  styleUrl: './shopping-form.component.css',
})
export class ShoppingFormComponent {
  @Input('cart') cart: ShoppingCart;

  shipping = { name: '', city: '', address: '' };
  user: AppUser;
  subscription: Subscription;

  constructor(
    private authService: AuthService,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    this.subscription = this.authService.user$.subscribe(
      (user) => (this.user = user!)
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  async onSubmit() {
    const order = new Order(this.user.id, this.shipping, this.cart.items);
    await this.orderService.placeOrder(order);
  }
}
