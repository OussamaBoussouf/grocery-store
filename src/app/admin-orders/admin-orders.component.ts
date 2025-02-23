import { Component } from '@angular/core';
import { OrderService } from '../services/order.service';
import { Order } from '../models/order';

@Component({
  selector: 'admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.css',
})
export class AdminOrdersComponent {
  orders: Order[];

  constructor(
    private orderService: OrderService,
  ) {}

  ngOnInit() {
    this.orderService
      .getAll()
      .then((orders) => (this.orders = orders))
      .catch((error) => console.log(error));
  }

}
