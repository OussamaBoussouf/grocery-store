import { Injectable } from '@angular/core';
import { User } from '@angular/fire/auth';
import { doc, Firestore, getDoc } from '@angular/fire/firestore';
import { setDoc } from '@firebase/firestore';
import { AppUser } from '../models/app-user';
import { FirebaseError } from '@angular/fire/app';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private firestore: Firestore) {}

  async save(user: User){
    try {
      const userDoc = await getDoc(doc(this.firestore, `users/${user.uid}`));
      if (!userDoc.exists()) {
        await setDoc(doc(this.firestore, `users/${user.uid}`), {
          email: user.email,
          name: user.displayName,
          isAdmin: false,
        });
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

  async get(uid: string | undefined) {
    if (!uid) return;
    const userDoc = await getDoc(doc(this.firestore, `users/${uid}`));
    return userDoc.data() as AppUser;
  }
}
