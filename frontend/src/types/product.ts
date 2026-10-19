export const STOCK_STATUSES = [
  'in_stock',
  'low_stock',
  'out_of_stock',
] as const;

export type StockStatus = (typeof STOCK_STATUSES)[number];

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock_status: StockStatus;
}

export interface PaginatedProducts {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductFilters {
  category: string;
  stockStatus: StockStatus | '';
}
