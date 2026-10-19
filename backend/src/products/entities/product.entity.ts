import { StockStatus } from '../enums/stock-status.enum.js';

export class Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock_status: StockStatus;
}