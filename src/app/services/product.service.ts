import { Injectable } from '@angular/core';
import { collection, Firestore, getDocs } from '@angular/fire/firestore';
import { catchError, from, map, Observable } from 'rxjs';

interface IPorudcts {
  title: string;
  price: number;
  category: string;
  image: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  products!: IPorudcts[];

  constructor(private fireStore: Firestore) {}

  getAllProducs(): Observable<IPorudcts[]> {
    const groceryCollection = collection(this.fireStore, 'grocery');

    return from(getDocs(groceryCollection)).pipe(
      map((snapshot) => snapshot.docs.map((doc) => doc.data() as IPorudcts)),
      catchError((error) => {
        console.log('Error fetching products', error);
        throw error;
      })
    );
  }
}
