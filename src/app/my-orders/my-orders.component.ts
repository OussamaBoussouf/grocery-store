import { Component } from '@angular/core';
import { OrderService } from '../services/order.service';
import { Order } from '../models/order';
import { AuthService } from '../services/auth.service';
import { AppUser } from '../models/app-user';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.css',
})
export class MyOrdersComponent {
  orders: Order[];
  userSubscription : Subscription;
  user: AppUser;

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {
    this.userSubscription = this.authService.user$.subscribe(user => this.user = user!);
  }

  ngOnInit() {
    this.orderService
      .get(this.user.id)
      .then((orders) => (this.orders = orders))
      .catch((error) => console.log(error));
  }

  ngOnDestroy(){
    this.userSubscription.unsubscribe();
  }
}
