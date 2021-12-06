import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { TableModel } from 'src/app/models/table.model';
import { Product } from 'src/app/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class JsonService {

  jsonFile = '../../assets/json/potato_sales.json';
  tableModel: TableModel = {
    column: [],
    data: []
  };
  private tableDataStore: BehaviorSubject<TableModel> = new BehaviorSubject<TableModel>(this.tableModel);
  public readonly tableData$: Observable<TableModel> = this.tableDataStore.asObservable();

  constructor(private http: HttpClient) {
    this.initDataSource();
  }

  private initDataSource(): void {
    this.getJSON().subscribe((jsonData: TableModel) => {
      this.configureTableData(jsonData);
    });
  }



  public addProduct(product: Product): void {
    const currentData = this.tableDataStore.value;
    product.totalSales = Number(product.salesQ1) + Number(product.salesQ2) + Number(product.salesQ3) + Number(product.salesQ4);
    currentData.data.push(product);
    this.tableDataStore.next(currentData);
  }


  public updateProduct(atIndex: number, product: Product): void {
    const currentData = this.tableDataStore.value;
    currentData.data[atIndex] = product;
    const updatedTable = {
      column: [...currentData.column], data: [...currentData.data]
    };
    // console.log('[JsonService] updatedTable ', updatedTable);
    this.tableDataStore.next(updatedTable);
  }

  private configureTableData(jsonData: TableModel): void {
    const tableDataProducts = [...jsonData.data].map(obj => ({
      ...obj,
      totalSales: obj.salesQ1 + obj.salesQ2 + obj.salesQ3 + obj.salesQ4
    }));
    const tableViewHeaders = [...jsonData.column].map(obj => {
      if (obj.header.startsWith('Total')) { obj.field = 'totalSales'; }
      return { ...obj };
    });
    const updatedObject = { column: [...tableViewHeaders], data: [...tableDataProducts] };
    // console.log('[JsonService] updatedObject ', updatedObject);
    this.tableDataStore.next(updatedObject);

  }

  private getJSON(): Observable<TableModel> {
    return this.http.get<TableModel>(this.jsonFile);
  }
}
