import { Component, OnDestroy, OnInit } from '@angular/core';
import { Product } from '../models/product';
import { ProductService } from '../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { categories } from '../constants/constants';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnDestroy {
  filteredProducts: Product[] = [];
  products: Product[] = [];
  subscription: Subscription;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {
    this.subscription = this.productService
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
