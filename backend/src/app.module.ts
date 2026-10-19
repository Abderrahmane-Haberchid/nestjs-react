import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { ProductsController } from './products/products.controller.js';
import { ProductsService } from './products/products.service.js';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path/win32';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'backend',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'frontend', 'dist'),
      exclude: ['/api/(.*)'],
    }),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class AppModule {}
