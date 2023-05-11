import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Redis } from 'ioredis';
import { REDIS_PROVIDER } from '../database/database.constant';
import ProductModel from '../product/product.model';
import CartItemModel from './cartItem.model';
import { Op } from 'sequelize';

@Injectable()
export class CartItemService {
  constructor(
    @Inject('CARTITEM_REPOSITORY')
    private cartItemModel: typeof CartItemModel,

    @Inject('PRODUCT_REPOSITORY')
    private productModel: typeof ProductModel,
    @Inject(REDIS_PROVIDER) private cacheManager: Redis,
  ) {}

  async getCart(userId) {
    return await this.cartItemModel.findAll({
      include: [
        {
          model: ProductModel,
          attributes: ['id', 'sku', 'status', 'title', 'price'],
        },
      ],
      attributes: ['quantity'],
      where: {
        userId,
      },
      limit: 30,
      offset: 0,
    });
  }

  async getCartItem(id): Promise<CartItemModel> {
    return (
      await this.cartItemModel.findOne({
        include: [
          {
            model: ProductModel,
            attributes: ['id', 'sku', 'status', 'title', 'price'],
          },
        ],
        attributes: ['quantity', 'userId'],
        where: {
          id,
        },
      })
    )?.toJSON();
  }

  async delete(userId, productId): Promise<any> {
    await this.cartItemModel.destroy({
      where: { id: productId },
      force: true,
    });
  }

  /**
   *
   * @param userId
   * @param productId
   * @description this function is to create the product
   */
  async addCartItem(userId, productId): Promise<void> {
    const product = await this.productModel.findOne({
      where: { id: productId },
    });
    // TODO: validate if product exists
    if (product) {
      await this.cartItemModel.create({
        quantity: 1,
        userId,
        productId,
        price: product.price,
      });
    } else {
      throw new UnprocessableEntityException();
    }
  }

  /**
   *
   * @param userId
   * @param cartItemtId
   * @param quantity
   * @description: the function updates the quantity of cart item
   */
  async updateCartItem(userId, cartItemtId, quantity): Promise<void> {
    // TODO: Authorization
    await this.cartItemModel.update(
      {
        quantity: quantity,
      },
      {
        where: {
          id: cartItemtId,
        },
      },
    );
  }

  /**
   *
   * @param userId
   * @param items
   * @returns
   * @description: New data will be inserted and override the older data if found, will not delete any item.
   */
  async mergeCart(userId, items) {
    // Get all the products and prices.
    const products = await this.productModel.findAll({
      where: {
        id: {
          [Op.in]: items.map((item) => {
            return items.productId;
          }),
        },
      },
      limit: 100, // Max number to avoid overload
    });

    const productMap = new Map();
    products.forEach((product) => {
      productMap.set(product.id, {
        price: product,
      });
    });

    return this.cartItemModel.bulkCreate(
      items.map((item) => {
        item.userId = userId;
        item.price = productMap.get(item.productId)?.price;
        return item;
      }),
      {
        conflictAttributes: ['userId', 'productId'],
        updateOnDuplicate: ['quantity'],
        returning: true,
      },
    );
  }
}
