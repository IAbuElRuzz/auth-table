import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JsonService } from 'src/app/services/json.service';
import { HttpClientModule } from '@angular/common/http';
import { SalesRoutingModule } from './sales.routing.module';
import { SalesComponent } from './sales.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSearchPipe } from '../pipes/table-search.pipe';

@NgModule({
  declarations: [
    SalesComponent,
    TableSearchPipe
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    SalesRoutingModule,
    FormsModule,
    ReactiveFormsModule,

  ],
  providers: [JsonService],
})
export class SalesModule { }
