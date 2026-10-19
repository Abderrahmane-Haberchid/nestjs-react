import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from '../src/products/products.module.js';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/products (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/v1/products')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          total: 50,
          page: 1,
          limit: 10,
          totalPages: 5,
        });
        expect(body.data).toHaveLength(10);
        expect(body.data[0]).toEqual(
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            category: expect.any(String),
            price: expect.any(Number),
            stock_status: expect.stringMatching(
              /^(in_stock|low_stock|out_of_stock)$/,
            ),
          }),
        );
      });
  });

  it('/products validates pagination and filter values', () => {
    return request(app.getHttpServer())
      .get('/api/v1/products?page=0&stock_status=invalid')
      .expect(400)
      .expect(({ body }) => {
        expect(body.statusCode).toBe(400);
        expect(body.message).toEqual(expect.any(Array));
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
