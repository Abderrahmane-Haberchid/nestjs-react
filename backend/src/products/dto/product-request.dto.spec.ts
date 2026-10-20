import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ProductsQueryDto } from './product-request.dto.js';

describe('ProductsQueryDto', () => {
  it('transforms valid pagination query strings into numbers', async () => {
    const dto = plainToInstance(ProductsQueryDto, {
      page: '3',
      limit: '25',
      category: 'Electronics',
      stock_status: 'low_stock',
    });

    expect(dto.page).toBe(3);
    expect(dto.limit).toBe(25);
    expect(await validate(dto)).toEqual([]);
  });

  it.each([
    { page: '0' },
    { page: '1.5' },
    { limit: '101' },
    { limit: 'not-a-number' },
    { category: '' },
    { category: 'x'.repeat(81) },
    { stock_status: 'unknown' },
  ])('rejects invalid query values %#', async (query) => {
    const dto = plainToInstance(ProductsQueryDto, query);

    expect(await validate(dto)).not.toHaveLength(0);
  });

  it('applies pagination defaults when omitted', () => {
    const dto = plainToInstance(ProductsQueryDto, {});

    expect(dto.page).toBe(1);
    expect(dto.limit).toBe(10);
  });
});
