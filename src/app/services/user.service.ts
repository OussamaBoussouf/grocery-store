import { Injectable } from '@angular/core';
import { User } from '@angular/fire/auth';
import { doc, Firestore, getDoc } from '@angular/fire/firestore';
import { setDoc } from '@firebase/firestore';
import { AppUser } from '../models/app-user';
import { FirebaseError } from '@angular/fire/app';
import { ShoppingCartService } from './shopping-cart.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private firestore: Firestore, private cartService:ShoppingCartService) {}

  async save(user: User) {
    try {
      let userDoc = await getDoc(doc(this.firestore, `users/${user.uid}`));

      if (!userDoc.exists()) {
        const userInfo = {
          id: user.uid,
          email: user.email,
          name: user.displayName,
          isAdmin: false,
        };
        await setDoc(
          doc(this.firestore, `users/${user.uid}`),
          userInfo
        );

        return userInfo as AppUser;
      }

      return userDoc.data() as AppUser;
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.log(error.code, error.message);
      } else {
        console.log(error);
      }
      return undefined;
    }
  }

  async get(uid: string) {
    const userDoc = await getDoc(doc(this.firestore, `users/${uid}`));
    return userDoc.data() as AppUser;
  }
}
