import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  DoCheck,
  OnInit,
} from '@angular/core';
import { ProductService } from '../services/product.service';

interface IProduct {
  id?: number;
  image: string;
  title: string;
  price: number;
  category: string;
}

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.css',
})
export class AdminProductsComponent implements OnInit {
  products: IProduct[] = [];
  searchedTerm = '';
  resultStart: number;
  resultEnd: number;
  sortDirection = '';
  page = 1;
  pageSize = 5;
  collectionSize = this.products.length;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getAllProducs().subscribe((data) => {
      this.products = data.map((product, index) => ({
        id: index + 1,
        ...product,
      }));
      this.collectionSize = data.length;
      this.updateStartEndResult();
    });
  }

  sortColumn(columnName: keyof IProduct) {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';

    this.products = this.products
      .map((product, i) => ({
        id: i + 1,
        ...product,
      }))
      .sort((a, b) => {
        const res = this.comapre(a[columnName], b[columnName]);
        return this.sortDirection === 'asc' ? res : -res;
      });
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
    let products = this.products.filter((product) =>
      product.title.toLowerCase().includes(this.searchedTerm.toLowerCase())
    );

    this.collectionSize = products.length;
    this.resultEnd =
      products.length < this.pageSize * this.page
        ? products.length
        : this.pageSize * this.page;

    return products.slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize
    );
  }
}
