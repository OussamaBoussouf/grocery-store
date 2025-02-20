import { Component } from '@angular/core';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { ShoppingCart } from '../models/shopping-cart';
import { Observable, Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  cartSubscription : Subscription;
  cart$ : Observable<ShoppingCart>;

  constructor(private cartService: ShoppingCartService){}

  async ngOnInit(){
    this.cartSubscription = this.cartService.cartId$.subscribe(cartId => {
      if (this.cartSubscription) this.cartSubscription.unsubscribe();
      this.cart$ = this.cartService.getCart(cartId);
    })
  }

  ngOnDestroy(){
    this.cartSubscription.unsubscribe();
  }


  onSubmit(form: NgForm){
    console.log(form.value);
  }

}
