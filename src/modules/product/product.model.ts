import * as _ from 'lodash';
import {
  BelongsToMany,
  Column,
  ForeignKey,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { BaseModel } from '../base.model';
import { Exclude } from 'class-transformer';

export enum ProductStatus {
  active = 'active',
  inactive = 'inactive',
}

@Table({
  modelName: 'products',
  indexes: [
    {
      fields: ['title'],
    },
    {
      fields: ['sku'],
      unique: true,
    },
  ],
})
export class ProductModel extends BaseModel {
  @Column({ type: DataTypes.CHAR })
  title: string;

  @Column({ type: DataTypes.INTEGER })
  stock: number;

  @Column({ type: DataTypes.FLOAT })
  price: number;

  @Column({ type: DataTypes.CHAR })
  sku: string;

  @Column({
    type: DataTypes.ENUM,
    values: Object.values(ProductStatus),
    defaultValue: ProductStatus.inactive,
  })
  status: ProductStatus;
}

export const productProviders = [
  {
    provide: 'PRODUCT_REPOSITORY',
    useValue: ProductModel,
  },
];

export default ProductModel;
