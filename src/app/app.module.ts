import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { HomeComponent } from './home/home.component';
import { AdminOrdersComponent } from './admin-orders/admin-orders.component';
import { AdminProductsComponent } from './admin-products/admin-products.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { OrderSuccessComponent } from './order-success/order-success.component';
import { LoginComponent } from './login/login.component';
import { ProductsComponent } from './products/products.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment.development';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ShoppingCartComponent,
    HomeComponent,
    AdminOrdersComponent,
    AdminProductsComponent,
    MyOrdersComponent,
    CheckoutComponent,
    OrderSuccessComponent,
    LoginComponent,
    ProductsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgbModule,
    NgbDropdownModule
  ],
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
