import { ShoppingCartItem } from './shopping-cart-item';

export class Order {
  createdAt: number;
  items: any[];

  constructor(
    public userId: string,
    public shipping: any,
    shoppingCart: ShoppingCartItem[]
  ) {
    this.createdAt = new Date().getTime();
    this.shipping = shipping;
    this.items = shoppingCart.map((item) => ({
      title: item.title,
      quantity: item.quantity, 
      price: item.price,
      imageUrl: item.imageUrl,
    }));
    this.userId = userId;
  }
}
