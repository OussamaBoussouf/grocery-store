import { Component, Input, TemplateRef } from '@angular/core';
import { Order } from '../models/order';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent {
  @Input('orders') orders : Order[];

  constructor(private modalService: NgbModal){}

  open(content: TemplateRef<any>) {
    this.modalService.open(content, { ariaLabelledBy: 'order-info' });
  }
}
