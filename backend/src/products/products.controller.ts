import { Controller, Get, Query } from '@nestjs/common';
import { ProductsQueryDto } from './dto/product-request.dto.js';
import { ProductsService } from './products.service.js';

@Controller('api/v1/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getProducts(@Query() query: ProductsQueryDto) {
    return this.productsService.getProducts(query);
  }
}
