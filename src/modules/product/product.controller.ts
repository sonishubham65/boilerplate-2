import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Version,
} from '@nestjs/common';
import { AccessGuard } from '../auth/access.guard';
import { ProductService } from './product.service';

@UseGuards(AccessGuard)
@Controller({
  path: 'product',
  version: '1',
})
export class ProductController {
  constructor(private productService: ProductService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() body) {
    const product = await this.productService.createProduct(body);

    return {
      message: 'A new product has been listed.',
      data: { product },
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async list() {
    const products = await this.productService.getProducts();
    return {
      data: { products },
    };
  }
}
