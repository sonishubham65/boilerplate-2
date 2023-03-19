import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { productProviders } from './product.model';

@Module({
  providers: [ProductService, ...productProviders],
  controllers: [ProductController],
})
export class ProductModule {}
