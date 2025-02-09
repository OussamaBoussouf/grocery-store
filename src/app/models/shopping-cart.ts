import { Product } from "./product";

export type ShoppingCart = Product & {quantity: number};