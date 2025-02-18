import { Component, OnDestroy, OnInit } from '@angular/core';
import { Product } from '../models/product';
import { ProductService } from '../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { ShoppingCart } from '../models/shopping-cart';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnDestroy {
  filteredProducts: Product[] = [];
  products: Product[] = [];
  categorySubscription: Subscription;
  cartSubscription: Subscription;
  cart: ShoppingCart;

  constructor(
    private productService: ProductService,
    private cartService: ShoppingCartService,
    private route: ActivatedRoute
  ) {
    this.categorySubscription = this.productService
      .getAll()
      .pipe(
        switchMap((products) => {
          this.products = products;
          return this.route.queryParamMap;
        })
      )
      .subscribe((queryParam) => {
        const categoryParam = queryParam.get('category');
        this.filteredProducts = categoryParam
          ? this.products?.filter((p) => p.category == categoryParam)
          : this.products;
      });
  }

  async ngOnInit() {
    this.cartService.cartId$.subscribe((cartId) => {
      if (this.cartSubscription) this.cartSubscription.unsubscribe();
      this.cartSubscription = this.cartService
        .getCart(cartId)
        .subscribe((items) => (this.cart = items));
    });
  }

  ngOnDestroy(): void {
    this.categorySubscription.unsubscribe();
    this.cartSubscription.unsubscribe();
  }
}
