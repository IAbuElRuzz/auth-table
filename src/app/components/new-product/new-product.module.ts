import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { NewProductComponent } from './new-product.component';
import { NewProductRoutingModule } from './new-product.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    NewProductComponent,

  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NewProductRoutingModule,

  ],
  providers: [],
})
export class NewProductModule { }
