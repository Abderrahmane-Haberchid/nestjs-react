import {
  generateRandomProduct,
  generateRandomProducts,
  ProductsRepository,
} from './products.repository.js';
import { StockStatus } from '../enums/stock-status.enum.js';

describe('ProductsRepository', () => {
  it('generates the requested number of uniquely identified products', () => {
    const products = generateRandomProducts(30);

    expect(products).toHaveLength(30);
    expect(new Set(products.map((product) => product.id)).size).toBe(30);
    expect(
      products.every(
        (product) =>
          typeof product.id === 'number' &&
          product.name.length > 0 &&
          product.category.length > 0 &&
          product.price > 0 &&
          Object.values(StockStatus).includes(product.stock_status),
      ),
    ).toBe(true);
  });

  it('respects product overrides for deterministic fixtures', () => {
    expect(
      generateRandomProduct(7, {
        name: 'Fixture',
        category: 'Books',
        price: 12.5,
        stock_status: StockStatus.LOW_STOCK,
      }),
    ).toEqual({
      id: 7,
      name: 'Fixture',
      category: 'Books',
      price: 12.5,
      stock_status: StockStatus.LOW_STOCK,
    });
  });

  it('returns detached product objects from findAll', () => {
    const repository = new ProductsRepository(
      generateRandomProducts(1, { name: 'Original' }),
    );

    const firstRead = repository.findAll();
    firstRead[0].name = 'Changed';

    expect(repository.findAll()[0].name).toBe('Original');
  });
});
