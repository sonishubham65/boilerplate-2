import {
  ConflictException,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Redis } from 'ioredis';
import {
  PRODUCT_REPOSITORY,
  REDIS_PROVIDER,
} from '../database/database.constant';
import ProductModel from './product.model';
import * as moment from 'moment';
@Injectable()
export class ProductService {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private productModel: typeof ProductModel,

    @Inject(REDIS_PROVIDER) private cacheManager: Redis,
  ) {}
  async createProduct(body) {
    const product = new ProductModel(body);
    const productKey = `PRODUCT_CREATE_${body.sku}`;
    if (!(await this.cacheManager.get(productKey))) {
      const lock = await this.cacheManager.setnx(productKey, moment().unix());
      if (lock) {
        return await product.save();
      } else {
        throw new ConflictException(
          'Someone else has already aquired lock for the same SKU.',
        );
      }
    } else {
      throw new UnprocessableEntityException('Duplicate SKU');
    }
  }

  async getProducts() {
    return await this.productModel.findAll({
      attributes: ['id', 'title', 'price', 'sku'],
      where: {
        status: 'active',
      },
    });
  }

  async getProduct(id) {
    return await this.productModel.findOne({
      attributes: ['id', 'title', 'price', 'sku', 'stock'],
      where: {
        id,
      },
    });
  }
}
