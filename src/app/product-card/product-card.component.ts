import { Component, Input } from '@angular/core';
import { Product } from '../models/product';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { ShoppingCart } from '../models/shopping-cart';

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
  @Input('product') product: Product;
  @Input('show-actions') showActions = true;
  @Input('shopping-cart') shoppingCart: ShoppingCart;

  constructor(private cartService: ShoppingCartService) {}

  incrementQty(productId: string) {
    this.cartService
      .incrementQuantity(productId)
      .catch((error) => {
        console.error(error);
      });
  }

  decrementQty(productId: string) {
    this.cartService
      .decrementQuantity(productId)
      .catch((error) => {
        console.error(error);
      });
  }

  addToCart(product: Product) {
    this.cartService
      .addToCart(product)
      .catch((error) => console.log(error));
  }

  getQuantity() {
    if (!this.shoppingCart) return 0;
    let item =this.shoppingCart.productQuantity(this.product.productId);
    return item ? item.quantity : 0;
  }
}
