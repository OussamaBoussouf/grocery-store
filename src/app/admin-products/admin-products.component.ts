import { Component, OnInit } from '@angular/core';

interface IProduct {
  id: number;
  food: string;
  price: number;
}

const PRODUCTS = [
  {
    food: 'Spanich',
    price: 2.5,
  },
  {
    food: 'Avocado',
    price: 3.0,
  },
  {
    food: 'Tomato',
    price: 1.0,
  },
  {
    food: 'Salt',
    price: 0.5,
  },
  {
    food: 'Onion',
    price: 0.5,
  },
  {
    food: 'Pepper',
    price: 5.0,
  },
  {
    food: 'Black Pepper',
    price: 2.1,
  },
];

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.css',
})
export class AdminProductsComponent implements OnInit {
  products: IProduct[];
  resultStart : number;
  resultEnd:number;
  sortDirection = '';
  page = 1;
  pageSize = 5;
  collectionSize = PRODUCTS.length;

  ngOnInit(): void {
    this.products = PRODUCTS.map((product, i) => ({
      id: i + 1,
      ...product,
    }));
    this.updateStartEndResult();
  }

  sortColumn(columnName: keyof IProduct) {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';

    this.products = PRODUCTS.map((product, i) => ({
      id: i + 1,
      ...product,
    })).sort((a, b) => {
      const res = this.comapre(a[columnName], b[columnName]);
      return this.sortDirection === 'asc' ? res : -res;
    });
  }

  search(term: string) {
    this.products = PRODUCTS.map((product, i) => ({
      id: i + 1,
      ...product,
    })).filter((product) =>
      product.food.toLowerCase().includes(term.toLowerCase())
    );

    this.collectionSize = this.products.length;

    this.updateStartEndResult();
  }

  updateStartEndResult() {
    this.resultStart =
      this.collectionSize === 0
        ? 0
        : this.page * this.pageSize - this.pageSize + 1;

    this.resultEnd =
      this.pageSize * this.page < this.collectionSize
        ? this.pageSize * this.page
        : this.collectionSize;
  }

  private comapre(v1: string | number, v2: string | number) {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }

  get allProducts() {
    return this.products.slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize
    );
  }
}
