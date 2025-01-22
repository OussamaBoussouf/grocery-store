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
import { doc, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private connectedUser = new BehaviorSubject<User | null>(null);
  private unsubscribeAuthState: (() => void) | null = null;
  user$ = this.connectedUser.asObservable();

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {
    this.unsubscribeAuthState = onAuthStateChanged(this.auth, (user) => {
      this.connectedUser.next(user);
    });
  }

  ngOnDestroy(): void {
    if (this.unsubscribeAuthState) this.unsubscribeAuthState();
  }

  async signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this.auth, provider);
      const user = result.user;

      //IF THE USER DOESN'T EXIST ON OUR FIREBASE DB CREATES THAT USER RECORD OTHERWISE SKIP
      const userExistInDB = (
        await getDoc(doc(this.firestore, `users/${user.uid}`))
      ).exists();
      if (!userExistInDB) {
        await setDoc(doc(this.firestore, `users/${user.uid}`), {
          email: user.email,
          name: user.displayName,
          isAdmin: false,
        });
      }

      this.router.navigate(['/']);
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.log(error.code, error.message);
      } else {
        console.log(error);
      }
    }
  }

  async signOut() {
    try {
      await signOut(this.auth);
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.log(error.code, error.message);
      } else {
        console.log(error);
      }
    }
  }
}
