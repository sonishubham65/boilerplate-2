import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import ProductModel from './product.model';

@Injectable()
export class ProductService {
  constructor(
    @Inject('PRODUCT_REPOSITORY')
    private productModel: typeof ProductModel,
  ) {}
  async createProduct(data: Partial<ProductModel>) {
    const product = new ProductModel(data);
    try {
      return await (await product.save()).toJSON();
    } catch (e) {
      if (
        e.parent?.code == 23505 &&
        e.parent?.constraint == 'products_sku_key'
      ) {
        throw new UnprocessableEntityException('Duplicate SKU');
      } else {
        throw e;
      }
    }
  }
}
