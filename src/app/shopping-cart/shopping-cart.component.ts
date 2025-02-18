import { Component } from '@angular/core';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { Observable, Subscription } from 'rxjs';
import { ShoppingCart } from '../models/shopping-cart';

@Component({
  selector: 'shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css',
})
export class ShoppingCartComponent {
  cartSubscription: Subscription;
  cart$: Observable<ShoppingCart>;

  constructor(private cartService: ShoppingCartService) {}

  ngOnInit() {
    this.cartSubscription = this.cartService.cartId$.subscribe((cartId) => {
      this.cart$ = this.cartService.getCart(cartId);
    });
  }

  ngOnDestroy(){
    this.cartSubscription.unsubscribe();
  }

  incrementQuantity(productId: string){
    this.cartService.incrementQuantity(productId);
  }

  decrementQuantity(productId: string){
    this.cartService.decrementQuantity(productId);
  }

  clearCart(){
    this.cartService.clearCart();
  }

}
