import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.scss']
})
export class NewProductComponent implements OnInit {
  productForm: FormGroup;
  isLoading = false;
  hasSubmitted = false;

  formObjectValues = {};
  placeHolderMessages = {
    productName: 'Product Name',
    productID: 'The Product ID',
    productManager: 'The person who Manages the product',
    salesDateStart: 'A date in the following format dd/mm/yyyy , Example : 21/12/2021',
  };

  validationMessages = {
    productName: [],
    productID: [],
    productManager: [],
    salesDateStart: []
  };

  numbersOnlyPattern = '^[0-9]*$';
  maxDate: Date = new Date();
  minDate: Date = new Date();


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
  ) { }

  ngOnInit() {


    this.setForms();
    this.setValidationErrors();
    this.setDates();

  }
  private setValidationErrors(): void {

    this.validationMessages = {
      productName: [
        {
          type: 'required',
          message: 'Product Name is required'
        },

        {
          type: 'minlength',
          message: 'Min 3 characters'
        },
        {
          type: 'maxlength',
          message: 'Max 50 characters'
        },
      ],
      productID: [
        {
          type: 'required',
          message: 'Product Id is required'
        },

        {
          type: 'minlength',
          message: 'Min 3 characters'
        },
        {
          type: 'maxlength',
          message: 'Max 13 numbers'
        },
        {
          type: 'pattern',
          message: 'Only numbers'
        },
      ],
      productManager: [

        {
          type: 'maxlength',
          message: 'Max 30 characters'
        },
        {
          type: 'minlength',
          message: 'Min 3 characters'
        },
      ],
      salesDateStart: [
        {
          type: 'required',
          message: 'A date in required'
        },

        {
          type: 'minlength',
          message: 'Max 10 character'
        },
        {
          type: 'maxlength',
          message: 'Max 10 character'
        },
        {
          type: 'minDateRange',
          message: 'Min 10 years before today'
        },
        {
          type: 'maxDateRange',
          message: 'Max 10 years before today'
        },

      ]
    };
  }
  private setDates(rangeMinMax: number = 3652): void {
    // YEARS TO DAYS :::
    // 10 years ~ 3652 days
    // 25 years ~ 9125 days
    this.maxDate = this.addSubstractDays(new Date(), rangeMinMax, '+');
    this.minDate = this.addSubstractDays(new Date(), rangeMinMax, '-');

  }

  get formControls() {
    return this.productForm.controls;
  }

  private async setForms () {

  this.productForm = this.formBuilder.group({
    productName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    productID: ['', [Validators.required,
    Validators.pattern(this.numbersOnlyPattern), Validators.minLength(3), Validators.maxLength(13),
    ]],
    productManager: ['', [
      Validators.minLength(3), Validators.maxLength(30)
    ]],
    salesDateStart: ['', [
      Validators.required,
      Validators.minLength(10), Validators.maxLength(10),
      this.dateRangeValidator.bind(this)
    ]],
  });
}


dateRangeValidator(control: FormControl): { [s: string]: boolean } {
  if (control.value) {
    const formDate = new Date(control.value);
    // console.log('dateRangeValidator ', formDate);
    if (formDate > new Date(this.maxDate)) {
      return { maxDateRange: true };
    }
    if (formDate < new Date(this.minDate)) {
      return { minDateRange: true };
    }
  }
  return null;
}

addSubstractDays(date: Date, numberOfDays: number, variation: string): Date {
  const dateStart = new Date(date);
  const dateVariation = variation === '+' ? (dateStart.getDate() + numberOfDays) : (dateStart.getDate() - numberOfDays);
  const calculatedDate = new Date(dateStart.getFullYear(), dateStart.getMonth(), dateVariation);
  return calculatedDate;
}
submitForm(): void {
  this.hasSubmitted = true;
  if(this.productForm.invalid) {
  return;
} else {
  this.isLoading = true;
  this.hasSubmitted = false;

  setTimeout(() => {
    this.isLoading = false;
    this.formObjectValues = { ...this.productForm.value };
    console.log('this.productForm.value ', this.productForm.value);
    this.productForm.reset();
    this.productForm.setErrors(null);

  }, 500);
}
  }
clearForm() {
  console.log('clearForm ');
  this.productForm.reset();

}
}
