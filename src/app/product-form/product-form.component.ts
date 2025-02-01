import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';

interface IPorudct {
  title: string;
  price: number;
  category: string;
  imageUrl: string;
}

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css',
})
export class ProductFormComponent {
  product: IPorudct = {
    price: 0,
    category: '',
    imageUrl: '',
    title: '',
  };
  productId: string | null;
  isLoading = false;

  constructor(
    private toastr: ToastrService,
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.productId = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.productId)
      this.productService
        .getById(this.productId)
        .pipe(take(1))
        .subscribe((data) => {
          if (data) this.product = data;
          else this.router.navigate(['not-found']);
        });
  }

  async onDelete() {
    try {
      if (
        this.productId &&
        confirm('Are you sure you want to delete this product')
      ) {
        await this.productService.delete(this.productId);
        this.toastr.success('product deleted successfully');
        this.router.navigate(['/admin/products']);
      }
    } catch (error) {
      this.toastr.error((error as Error).message);
    }
  }

  async onSubmit(form: NgForm) {
    try {
      this.isLoading = true;
      //UPDATE OR CREATE A PRODUCT RECORED BASED ON THE EXISTENCE OF AN ID
      if (this.productId) {
        await this.productService.update(this.productId, form.value);
        this.toastr.success('product updated successfully');
        this.router.navigate(['/admin/products']);
      } else {
        await this.productService.create(form.value);
        this.toastr.success('product created successfully');
        form.reset();
      }
    } catch (error) {
      this.toastr.error((error as Error).message);
    } finally {
      this.isLoading = false;
    }
  }
}
