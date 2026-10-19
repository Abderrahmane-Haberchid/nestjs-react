import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ProductsModule } from './products/products.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

const frontendDistPath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../../frontend/dist',
);

@Module({
  imports: [
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'backend',
    }),
    ProductsModule,
    ServeStaticModule.forRoot({
      rootPath: frontendDistPath,
      exclude: ['/api/(.*)'],
    }),
  ],
})
export class AppModule {}
