import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AccessGuard } from '../auth/access.guard';
import { ProductService } from './product.service';

@UseGuards(AccessGuard)
@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async signup(@Body() body) {
    const product = await this.productService.createProduct(body);
    // TODO: Send Email for verification.
    return {
      message: 'You are registered successfully.',
      data: { product },
    };
  }
}
