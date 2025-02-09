import { Injectable, OnDestroy } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import {
  Auth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User,
} from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, switchMap } from 'rxjs';
import { UserService } from './user.service';


@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private connectedUser = new BehaviorSubject<User | null>(null);
  private unsubscribeAuthState: (() => void) | null = null;

  private user$ = this.connectedUser.asObservable();

  constructor(
    private auth: Auth,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.unsubscribeAuthState = onAuthStateChanged(this.auth, (user) => {
      this.connectedUser.next(user);
    });
  }

  ngOnDestroy(): void {
    if (this.unsubscribeAuthState) this.unsubscribeAuthState();
  }

  get appUser$(){
    return this.user$.pipe(
      switchMap(user => {
        return this.userService.get(user?.uid);
      })
    )
  }

  async logInWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this.auth, provider);
      const user = result.user;

      //save user records to db if it doesn't already exist
      const appUser = await this.userService.save(user);

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
