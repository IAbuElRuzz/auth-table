export interface SubHeader {
  header: string;
  field?: string;
}

export interface TableHeader {
  header: string;
  field?: string;
  subHeaders?: {
    [key: string]: SubHeader
  };
}
