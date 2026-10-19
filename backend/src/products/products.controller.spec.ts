import { Test, TestingModule } from '@nestjs/testing';
import { StockStatus } from './enums/stock-status.enum.js';
import { Product } from './entities/product.entity.js';
import { ProductsRepository } from './repository/products.repository.js';
import { ProductsController } from './products.controller.js';
import { ProductsService } from './products.service.js';

describe('ProductsController', () => {
  let productsController: ProductsController;
  const products: Product[] = [
    {
      id: 1,
      name: 'Wireless Headphones',
      category: 'Electronics',
      price: 99.99,
      stock_status: StockStatus.IN_STOCK,
    },
    {
      id: 2,
      name: 'Cotton T-Shirt',
      category: 'Clothing',
      price: 24.5,
      stock_status: StockStatus.LOW_STOCK,
    },
    {
      id: 3,
      name: 'Bluetooth Speaker',
      category: 'Electronics',
      price: 59.99,
      stock_status: StockStatus.OUT_OF_STOCK,
    },
  ];

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        ProductsService,
        {
          provide: ProductsRepository,
          useValue: new ProductsRepository(products),
        },
      ],
    }).compile();

    productsController = app.get<ProductsController>(ProductsController);
  });

  describe('GET /products', () => {
    it('returns paginated products', () => {
      expect(productsController.getProducts({ page: 1, limit: 2 })).toEqual({
        data: products.slice(0, 2),
        total: 3,
        page: 1,
        limit: 2,
        totalPages: 2,
      });
    });

    it('filters by category before paginating', () => {
      expect(
        productsController.getProducts({
          page: 1,
          limit: 1,
          category: 'Electronics',
        }),
      ).toEqual({
        data: [products[0]],
        total: 2,
        page: 1,
        limit: 1,
        totalPages: 2,
      });
    });

    it('filters by stock status', () => {
      expect(
        productsController.getProducts({
          page: 1,
          limit: 10,
          stock_status: StockStatus.OUT_OF_STOCK,
        }).data,
      ).toEqual([products[2]]);
    });
  });
});
