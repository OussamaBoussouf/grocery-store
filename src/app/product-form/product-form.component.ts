import { Component } from '@angular/core';
import { addDoc, collection, Firestore} from '@angular/fire/firestore';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent {

  constructor(private fireStore: Firestore, private toastr: ToastrService){}

  isLoading = false;

  async onSubmit(form: NgForm){
    try{
      this.isLoading = true;
      await addDoc(collection(this.fireStore, "grocery"), form.value);
      this.toastr.success('product created successfully');
      form.reset();
    }catch(error){
      console.error(error)
      this.toastr.error('an error occured while creating the product');
    }finally{
      this.isLoading = false;
    }
  }

}
