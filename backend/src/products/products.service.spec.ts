import { ProductsQueryDto } from './dto/product-request.dto.js';
import { Product } from './entities/product.entity.js';
import { StockStatus } from './enums/stock-status.enum.js';
import { ProductsRepository } from './repository/products.repository.js';
import { ProductsService } from './products.service.js';
import type { MockInstance } from 'vitest';

const products: Product[] = [
  {
    id: 1,
    name: 'Headphones',
    category: 'Electronics',
    price: 99,
    stock_status: StockStatus.IN_STOCK,
  },
  {
    id: 2,
    name: 'T-Shirt',
    category: 'Clothing',
    price: 25,
    stock_status: StockStatus.LOW_STOCK,
  },
  {
    id: 3,
    name: 'Speaker',
    category: 'Electronics',
    price: 59,
    stock_status: StockStatus.OUT_OF_STOCK,
  },
];

const query = (values: Partial<ProductsQueryDto> = {}) =>
  Object.assign(new ProductsQueryDto(), values);

describe('ProductsService', () => {
  let repository: ProductsRepository;
  let service: ProductsService;
  let findAllSpy: MockInstance<() => Product[]>;

  beforeEach(() => {
    repository = new ProductsRepository(products);
    findAllSpy = vi.spyOn(repository, 'findAll').mockReturnValue(products);
    service = new ProductsService(repository);
  });

  it('paginates records and reports the total before slicing', () => {
    expect(service.getProducts(query({ page: 2, limit: 2 }))).toEqual({
      data: [products[2]],
      total: 3,
      page: 2,
      limit: 2,
      totalPages: 2,
    });
  });

  it('applies category and stock filters before pagination', () => {
    expect(
      service.getProducts(
        query({
          page: 1,
          limit: 1,
          category: 'Electronics',
          stock_status: StockStatus.OUT_OF_STOCK,
        }),
      ),
    ).toEqual({
      data: [products[2]],
      total: 1,
      page: 1,
      limit: 1,
      totalPages: 1,
    });
  });

  it('returns an empty page when the requested page is beyond the result set', () => {
    expect(service.getProducts(query({ page: 4, limit: 1 }))).toEqual({
      data: [],
      total: 3,
      page: 4,
      limit: 1,
      totalPages: 3,
    });
  });

  it('caches identical queries and separates cache entries by filters and pagination', () => {
    service.getProducts(query({ page: 1, limit: 1 }));
    service.getProducts(query({ page: 1, limit: 1 }));
    service.getProducts(query({ page: 2, limit: 1 }));
    service.getProducts(query({ page: 1, limit: 1, category: 'Clothing' }));

    expect(findAllSpy).toHaveBeenCalledTimes(3);
  });

  it('does not let callers mutate cached product objects', () => {
    const firstResult = service.getProducts(query());
    firstResult.data[0].name = 'Mutated by caller';

    expect(service.getProducts(query()).data[0].name).toBe('Headphones');
  });

  it('evicts the oldest query after the cache reaches its capacity', () => {
    for (let page = 1; page <= 101; page += 1) {
      service.getProducts(query({ page }));
    }

    service.getProducts(query({ page: 1 }));

    expect(findAllSpy).toHaveBeenCalledTimes(102);
  });
});
