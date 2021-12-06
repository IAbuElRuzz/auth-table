import { TableHeader } from './table-header.model';
import { Product } from '../models/product.model';

export interface TableModel {
  column: TableHeader[];
  data: Product[];
}
