import { Injectable, OnDestroy } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import {
  Auth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { UserService } from './user.service';
import { AppUser } from '../models/app-user';
import { ShoppingCartService } from './shopping-cart.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private connectedUser = new BehaviorSubject<AppUser | undefined>(undefined);
  private unsubscribeAuthState: (() => void) | null = null;

  user$ = this.connectedUser.asObservable();

  constructor(
    private auth: Auth,
    private userService: UserService,
    private cartService: ShoppingCartService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.unsubscribeAuthState = onAuthStateChanged(this.auth, async (user) => {
      if (user && localStorage.getItem('user')) {
        const appUser = await this.userService.get(user.uid);
        this.connectedUser.next(appUser);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.unsubscribeAuthState) this.unsubscribeAuthState();
  }

  async logInWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this.auth, provider);

      //save user records to db if it doesn't already exist
      const appUser = await this.userService.save(result.user);

  
      if (appUser) this.cartService.linkOrCreate(appUser.id);

      this.connectedUser.next(appUser);

      localStorage.setItem('user', JSON.stringify(appUser));

      const returnUrl =
        this.route.snapshot.queryParamMap.get('returnUrl') || '/';
      this.router.navigateByUrl(returnUrl);
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.log(error.code, error.message);
      } else {
        console.log(error);
      }
    }
  }

  async logOut() {
    try {
      await signOut(this.auth);
      this.cartService.removeCartId();
      this.connectedUser.next(undefined);
      localStorage.removeItem('user');
      this.router.navigate(['/']);
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.log(error.code, error.message);
      } else {
        console.log(error);
      }
    }
  }
}
