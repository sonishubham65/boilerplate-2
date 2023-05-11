import * as _ from 'lodash';
import { BelongsTo, Column, Table } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { BaseModel } from '../base.model';
import ProductModel from '../product/product.model';
import UserModel from '../user/user.model';

@Table({
  modelName: 'cartItems',
  indexes: [
    {
      fields: [],
    },
  ],
})
export class CartItemModel extends BaseModel {
  @BelongsTo(() => UserModel, 'userId')
  user: UserModel;

  @BelongsTo(() => ProductModel, 'productId')
  product: ProductModel;

  @Column({ type: DataTypes.INTEGER })
  quantity: number;

  @Column({ type: DataTypes.FLOAT })
  price: number;
}

export const cartItemProviders = [
  {
    provide: 'CARTITEM_REPOSITORY',
    useValue: CartItemModel,
  },
];

export default CartItemModel;
