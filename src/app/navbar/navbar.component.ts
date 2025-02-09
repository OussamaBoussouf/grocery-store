import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AppUser } from '../models/app-user';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { ShoppingCart } from '../models/shopping-cart';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  appUser: AppUser | undefined;
  totalItems = 0;

  constructor(
    private authService: AuthService,
    private cartService: ShoppingCartService
  ) {
    this.authService.appUser$.subscribe((user) => (this.appUser = user));
  }

  async ngOnInit() {
    await this.cartService.getCart((docs) => {
      let total = 0;
      docs.forEach((doc) => {
        total += (doc.data() as ShoppingCart).quantity;
      });
      this.totalItems = total;
    });
  }

  logout() {
    this.authService.logOut();
  }
}
