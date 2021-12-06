import { Component, ElementRef, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { JsonService } from 'src/app/services/json.service';
import { Product } from 'src/app/models/product.model';
import { TableHeader } from 'src/app/models/table-header.model';
import { TableModel } from 'src/app/models/table.model';
import { skipWhile } from 'rxjs/operators';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit {
  @ViewChildren('clickButtons') clickButtons: ElementRef<HTMLButtonElement>[];
  @ViewChild('newProductBtn') newProductBtn: ElementRef;

  productForm: FormGroup;
  tableForm: FormGroup;


  isLoading = false;
  bottomFormVisible = false;
  addProductEnabled = true;

  searchTerm = '';

  tableViewData: Product[] = [];
  tableViewHeader: TableHeader[] = [];

  editMode = true;
  enabledFormIndex: number;
  editOrSave = 'edit';

  numbersOnlyPattern = '^[0-9]*$';



  validationMessages = {
    productName: [],
    productID: [],
    salesQ1: [],
    salesQ2: [],
    salesQ3: [],
    salesQ4: [],
    totalSales: [],
  };



  constructor(
    private jsonService: JsonService,
    private formBuilder: FormBuilder,
    private elementRef: ElementRef
  ) { }

  ngOnInit() {
    this.jsonService.tableData$.pipe(
      skipWhile(jsonData =>
        Object.keys(jsonData).length === 0 ||
        jsonData.column.length === 0 ||
        jsonData.data.length === 0
      ),
    )
      .subscribe((jsonData: TableModel) => {
        if (jsonData) {
          this.tableViewHeader = jsonData.column;
          this.tableViewData = jsonData.data;

          this.setTableForm();

        }
      });

    this.setProductForm();
    this.setValidationErrors();

  }



  sortElements(keyName: string, $event: Event) {

    const htmlIconElement = $event.currentTarget as HTMLElement;
    if (htmlIconElement.className === 'bi-sort-down') {
      htmlIconElement.className = 'bi-sort-up';
      this.tableViewData.sort((a, b) => {
        if (keyName === 'productName') {
          return a[keyName].localeCompare(b[keyName]);
        } else {
          return b[keyName] - a[keyName];
        }
      });
    } else {
      htmlIconElement.className = 'bi-sort-down';
      this.tableViewData.sort((a, b) => {
        if (keyName === 'productName') {
          return b[keyName].localeCompare(a[keyName]);
        } else {
          return a[keyName] - b[keyName];
        }
      });
    }
  }






  private setTableForm() {
    this.tableForm = this.formBuilder.group({
      tableRows: new FormArray([])
    });
  }
  get tableFormControls() { return this.tableForm.controls; }
  get rowTableArrayControls() { return this.tableFormControls.tableRows as FormArray; }




  getTableInvalidClass(row: FormArray, validationKey: string) {
    if (row.controls[validationKey].touched && row.controls[validationKey].errors) {
      return 'is-invalid';
    }
    if (row.controls[validationKey].touched && !row.controls[validationKey].errors) {
      return 'is-valid';
    }
  }
  getTableFormErrors(row: FormArray, validationKey: string, validation: any) {
    return row.controls[validationKey].hasError(validation.type) &&
      (row.controls[validationKey].pristine ||
        row.controls[validationKey].dirty ||
        row.controls[validationKey].touched);
  }

  updateFormProduct(formData: any): Product {
    let obj: Product = {} as Product;
    if (formData) {
      obj = {
        productName: formData.productName,
        productID: formData.productID,
        salesQ1: Number(formData.salesQ1),
        salesQ2: Number(formData.salesQ2),
        salesQ3: Number(formData.salesQ3),
        salesQ4: Number(formData.salesQ4),
        totalSales: Number(formData.totalSales),
      };
      return obj;
    }
  }

  updateButtonsStatus(rowIdx: number, editStatus: string) {

    if (editStatus === 'save') {
      this.newProductBtn.nativeElement.disabled = true;
      this.clickButtons.forEach((btn: any, idx: number) => {
        btn.nativeElement.disabled = rowIdx !== idx ? true : false;
        btn.nativeElement.textContent = rowIdx === idx ? 'save' : 'edit';
      });
    } else {
      this.newProductBtn.nativeElement.disabled = false;
      this.clickButtons.forEach((btn: any, idx: number) => {
        btn.nativeElement.disabled = false;
        btn.nativeElement.textContent = 'edit';
      });
    }

  }

  onClickBtn(rowIdx: number) {


    if (this.editMode) {

      this.enabledFormIndex = rowIdx;
      this.editMode = !this.editMode;
      this.updateButtonsStatus(rowIdx, 'save');


      const objIdx = { ...this.tableViewData[rowIdx] };
      this.rowTableArrayControls.push(this.formBuilder.group({
        productName: [objIdx.productName, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
        productID: [objIdx.productID, [Validators.required, Validators.pattern(this.numbersOnlyPattern), Validators.minLength(3), Validators.maxLength(13)]],
        salesQ1: [objIdx.salesQ1, [Validators.required, Validators.pattern(this.numbersOnlyPattern), Validators.minLength(3), Validators.maxLength(13),]],
        salesQ2: [objIdx.salesQ2, [Validators.required, Validators.pattern(this.numbersOnlyPattern), Validators.minLength(3), Validators.maxLength(13),]],
        salesQ3: [objIdx.salesQ3, [Validators.required, Validators.pattern(this.numbersOnlyPattern), Validators.minLength(3), Validators.maxLength(13),]],
        salesQ4: [objIdx.salesQ4, [Validators.required, Validators.pattern(this.numbersOnlyPattern), Validators.minLength(3), Validators.maxLength(13),]],
        totalSales: [objIdx.totalSales, [Validators.required, Validators.pattern(this.numbersOnlyPattern), Validators.minLength(1), Validators.maxLength(13),]],
      }));

    } else {

      if (this.tableForm.invalid) {

        return;

      } else {


        const updatedProduct = this.updateFormProduct(this.tableForm.value.tableRows[0]);

        this.jsonService.updateProduct(rowIdx, updatedProduct);
        this.tableForm.reset();
        this.tableForm.setErrors(null);

        this.editMode = !this.editMode;
        this.updateButtonsStatus(rowIdx, 'edit');

      }
      this.enabledFormIndex = null;
      this.rowTableArrayControls.removeAt(0);

    }
  }



  get formControls() {
    return this.productForm.controls;
  }


  getInvalidClass(validationKey: string) {
    if (this.productForm.get(validationKey).touched && this.productForm.get(validationKey).errors) {
      return 'is-invalid';
    }
    if (!this.productForm.get(validationKey).errors) {
      return 'is-valid';
    }
  }
  getFormErrors(validationKey: string, validation: any) {
    return this.productForm.get(validationKey).hasError(validation.type) &&
      (this.productForm.get(validationKey).pristine ||
        this.productForm.get(validationKey).dirty ||
        this.productForm.get(validationKey).touched);
  }

  private async setProductForm() {

    this.productForm = this.formBuilder.group({
      productName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      productID: ['', [Validators.required,
      Validators.pattern(this.numbersOnlyPattern), Validators.minLength(3), Validators.maxLength(13),
      ]],
      salesQ1: ['', [Validators.required,
      Validators.pattern(this.numbersOnlyPattern), Validators.minLength(3), Validators.maxLength(13),
      ]],
      salesQ2: ['', [Validators.required,
      Validators.pattern(this.numbersOnlyPattern), Validators.minLength(3), Validators.maxLength(13),
      ]],
      salesQ3: ['', [Validators.required,
      Validators.pattern(this.numbersOnlyPattern), Validators.minLength(3), Validators.maxLength(13),
      ]],
      salesQ4: ['', [Validators.required,
      Validators.pattern(this.numbersOnlyPattern), Validators.minLength(3), Validators.maxLength(13),
      ]],
      totalSales: ['', []],
    });
  }

  submitFormData() {
    this.addProductEnabled = !this.addProductEnabled;

    this.bottomFormVisible = true;
    if (this.productForm.invalid) {
      return;
    } else {
      this.isLoading = true;

      this.jsonService.addProduct(this.productForm.value);

      this.productForm.reset();
      this.productForm.setErrors(null);
      this.isLoading = false;

      this.bottomFormVisible = false;

    }
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
          message: 'Max 13 characters'
        },
        {
          type: 'pattern',
          message: 'Only numbers'
        },
      ],
      salesQ1: [
        {
          type: 'required',
          message: 'salesQ1 is required'
        },

        {
          type: 'minlength',
          message: 'Min 3 characters'
        },
        {
          type: 'maxlength',
          message: 'Max 13 characters'
        },
        {
          type: 'pattern',
          message: 'Only numbers'
        },
      ],
      salesQ2: [
        {
          type: 'required',
          message: 'salesQ2 is required'
        },

        {
          type: 'minlength',
          message: 'Min 3 characters'
        },
        {
          type: 'maxlength',
          message: 'Max 13 characters'
        },
        {
          type: 'pattern',
          message: 'Only numbers'
        },
      ],
      salesQ3: [
        {
          type: 'required',
          message: 'salesQ3 is required'
        },

        {
          type: 'minlength',
          message: 'Min 3 characters'
        },
        {
          type: 'maxlength',
          message: 'Max 13 characters'
        },
        {
          type: 'pattern',
          message: 'Only numbers'
        },
      ],

      salesQ4: [
        {
          type: 'required',
          message: 'salesQ4 is required'
        },

        {
          type: 'minlength',
          message: 'Min 3 characters'
        },
        {
          type: 'maxlength',
          message: 'Max 13 characters'
        },
        {
          type: 'pattern',
          message: 'Only numbers'
        },
      ],
      totalSales: [
        {
          type: 'required',
          message: 'Total Sales is required'
        },
        {
          type: 'minlength',
          message: 'Min 1 character'
        },
        {
          type: 'maxlength',
          message: 'Max 13 characters'
        },
        {
          type: 'pattern',
          message: 'Only numbers'
        },
      ],


    };
  }
}
