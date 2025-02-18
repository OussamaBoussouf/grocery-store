import { ShoppingCartItem } from './shopping-cart-item';

export class ShoppingCart {
  constructor(public items: ShoppingCartItem[]) {}

  productQuantity(productId: string){
    return this.items.find(item => productId === item.productId);
  }
  
  get totalPrice() {
    return this.items.reduce(
      (accumulator, currentValue) =>
        accumulator + currentValue.price * currentValue.quantity,
      0
    );
  }

  get totalItemsCount() {
    return this.items.reduce((total, current) => total + current.quantity, 0);
  }

}
