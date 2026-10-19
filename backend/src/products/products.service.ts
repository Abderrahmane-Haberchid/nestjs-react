import { Injectable } from '@nestjs/common';
import { ProductsQueryDto } from './dto/product-request.dto.js';
import { Product } from './entities/product.entity.js';
import { ProductsRepository } from './repository/products.repository.js';

export interface PaginatedProducts {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class ProductsService {
  
  private readonly cache = new Map<string, PaginatedProducts>();
  private readonly maxCacheEntries = 100;

  constructor(private readonly productsRepository: ProductsRepository) {}

  getProducts(query: ProductsQueryDto): PaginatedProducts {
    const cacheKey = JSON.stringify({
      page: query.page,
      limit: query.limit,
      category: query.category ?? null,
      stock_status: query.stock_status ?? null,
    });
    const cachedResult = this.cache.get(cacheKey);

    if (cachedResult) {
      return {
        ...cachedResult,
        data: cachedResult.data.map((product) => ({
          id: product.id,
          name: product.name,
          category: product.category,
          price: product.price,
          stock_status: product.stock_status,
        })),
      };
    }

    let products = this.productsRepository.findAll();

    if (query.category) {
      products = products.filter(
        (product) => product.category === query.category,
      );
    }

    if (query.stock_status) {
      products = products.filter(
        (product) => product.stock_status === query.stock_status,
      );
    }

    const total = products.length;
    const start = (query.page - 1) * query.limit;
    const result: PaginatedProducts = {
      data: products.slice(start, start + query.limit),
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit),
    };

    if (this.cache.size >= this.maxCacheEntries) {
      const oldestCacheKey = this.cache.keys().next().value;
      if (oldestCacheKey !== undefined) {
        this.cache.delete(oldestCacheKey);
      }
    }

    this.cache.set(cacheKey, result);
    return {
      ...result,
      data: result.data.map((product) => ({
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        stock_status: product.stock_status,
      })),
    };
  }
}
