import { Product } from '../entities/product.entity.js';
import { StockStatus } from '../enums/stock-status.enum.js';

export type ProductOverrides = Partial<Product>;

const PRODUCT_NAMES = [
  'Wireless Headphones',
  'Fitness Watch',
  'Smart Television',
  'Office Chair',
  'Bluetooth Speaker',
  'Steel Water Bottle',
  'Mechanical Keyboard',
  'Laptop Stand',
  'Cotton T-Shirt',
  'Robot Vacuum',
  'Coffee Grinder',
  'Wireless Charger',
  'Drawing Tablet',
  'Espresso Machine',
  'Indoor Grow Kit',
];

const PRODUCT_CATEGORIES = [
  'Electronics',
  'Clothing',
  'Food',
  'Home',
  'Books',
  'Sports',
  'Beauty',
];

const STOCK_STATUSES = [
  StockStatus.IN_STOCK,
  StockStatus.LOW_STOCK,
  StockStatus.OUT_OF_STOCK,
];

const randomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const generateRandomProduct = (
  id: number,
  overrides: ProductOverrides = {},
): Product => ({
  id: overrides.id ?? id,
  name:
    overrides.name ?? PRODUCT_NAMES[randomInt(0, PRODUCT_NAMES.length - 1)],
  category:
    overrides.category ??
    PRODUCT_CATEGORIES[randomInt(0, PRODUCT_CATEGORIES.length - 1)],
  price: overrides.price ?? Number((randomInt(5, 999) + Math.random()).toFixed(2)),
  stock_status:
    overrides.stock_status ??
    STOCK_STATUSES[randomInt(0, STOCK_STATUSES.length - 1)],
});

export const generateRandomProducts = (
  count = 50,
  overrides: ProductOverrides = {},
): Product[] =>
  Array.from({ length: Math.max(0, count) }, (_, index) =>
    generateRandomProduct(index + 1, overrides),
  );

export class ProductsRepository {
  constructor(
    private readonly products: Product[] = generateRandomProducts(),
  ) {}

  findAll(): Product[] {
    return this.products.map((product) => ({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      stock_status: product.stock_status,
    }));
  }
}

export default ProductsRepository;
