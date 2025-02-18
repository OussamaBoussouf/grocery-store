import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AppUser } from '../models/app-user';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { ShoppingCart } from '../models/shopping-cart';
import { ShoppingCartItem } from '../models/shopping-cart-item';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  appUser: AppUser | undefined;
  cartSubscription: Subscription;
  cart$: Observable<ShoppingCart>;

  constructor(
    private authService: AuthService,
    private cartService: ShoppingCartService
  ) {
    this.authService.appUser$.subscribe((user) => (this.appUser = user));
  }

  async ngOnInit() {
    this.cartService.cartId$.subscribe((cartId) => {
      if (this.cartSubscription) this.cartSubscription.unsubscribe();
      this.cart$ = this.cartService.getCart(cartId)
    });
    // const cart$ = await this.cartService.getCart();
    // cart$.subscribe((items) => {
    //   let total = 0;
    //   items.forEach((item) => {
    //     total += item.quantity;
    //   });
    //   this.totalItems = total;
    // })
  }

  logout() {
    this.authService.logOut();
  }
}
