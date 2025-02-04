import { Component } from '@angular/core';
import { categories } from '../constants/constants';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'product-filter',
  templateUrl: './product-filter.component.html',
  styleUrl: './product-filter.component.css'
})
export class ProductFilterComponent {
  categoryParam: string | null;
  categories = categories;

  constructor(private route: ActivatedRoute){
    this.route.queryParamMap.subscribe(queryParam => {
      this.categoryParam = queryParam.get('category');
    })
  }
}
