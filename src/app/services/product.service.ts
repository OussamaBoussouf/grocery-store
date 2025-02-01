import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  getDocs,
  updateDoc,
} from '@angular/fire/firestore';
import { catchError, from, map, Observable } from 'rxjs';


interface IPorudct {
  title: string;
  price: number;
  category: string;
  imageUrl: string;
  productId: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  products!: IPorudct[];

  constructor(private fireStore: Firestore) {}

  getAll(): Observable<IPorudct[]> {
    const groceryCollection = collection(this.fireStore, 'grocery');

    return from(getDocs(groceryCollection)).pipe(
      map((snapshot) =>
        snapshot.docs.map(
          (doc) => ({ productId: doc.id, ...doc.data() } as IPorudct)
        )
      ),
      catchError((error) => {
        console.log('Error fetching products', error);
        throw error;
      })
    );
  }

  async create(value: Omit<IPorudct, 'productId'>) {
    try {
      await addDoc(collection(this.fireStore, 'grocery'), value);
    } catch (error) {
      throw new Error('An error occured while creating the product');
    }
  }

  async update(productId: string, product: Omit<IPorudct, 'productId'>) {
    try {
      const productDoc = doc(this.fireStore, 'grocery', productId);
      await updateDoc(productDoc, product);
    } catch (error) {
      throw new Error('An error occured while saving the product');
    }
  }

  async delete(productId: string) {
    try {
      await deleteDoc(doc(this.fireStore, 'grocery', productId));
    } catch (error) {
      throw new Error('An error occured while deleting this product');
    }
  }

  getById(id: string): Observable<IPorudct> {
    const productRef = doc(this.fireStore, 'grocery', id);
    return from(getDoc(productRef)).pipe(
      map((docSnap) => docSnap.data() as IPorudct),
      catchError((error) => {
        console.log('Error fetching product', error);
        throw error;
      })
    );
  }
}
