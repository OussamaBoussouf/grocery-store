export interface AppUser {
  id:string;
  name: string;
  email: string;
  isAdmin: boolean;
  cartId?: string;
}
