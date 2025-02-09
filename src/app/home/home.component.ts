import { Component, OnDestroy, OnInit } from '@angular/core';
import { Product } from '../models/product';
import { ProductService } from '../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { ShoppingCart } from '../models/shopping-cart';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { Unsubscribe } from '@angular/fire/auth';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, OnDestroy {
  filteredProducts: Product[] = [];
  products: Product[] = [];
  categorySubscription: Subscription;
  cartSubscription: Unsubscribe;
  cart: ShoppingCart[] = [];

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
    this.cartSubscription = await this.cartService.getCart((docs) => {
      const cart: ShoppingCart[] = [];
      docs.forEach((doc) => {
        cart.push(doc.data() as ShoppingCart);
      });
      this.cart = cart;
    });
  }

  ngOnDestroy(): void {
    this.categorySubscription.unsubscribe();
    this.cartSubscription();
  }
}
