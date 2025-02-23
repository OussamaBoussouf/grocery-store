import { Component } from '@angular/core';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { ShoppingCart } from '../models/shopping-cart';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent {
  cartSubscription: Subscription;
  itemsSubscription: Subscription;
  cart$: Observable<ShoppingCart>;

  constructor(
    private cartService: ShoppingCartService,
  ) {}

  async ngOnInit() {
    this.cartSubscription = this.cartService.cartId$.subscribe((cartId) => {
      if (this.cartSubscription) this.cartSubscription.unsubscribe();
      this.cart$ = this.cartService.getCart(cartId);
    });
  }

  ngOnDestroy() {
    this.cartSubscription.unsubscribe();
    
  }
}
