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
import { POST_REPOSITORY } from '../database/database.constant';

export enum PostStatus {
  active = 'active',
  inactive = 'inactive',
}

@Table({
  modelName: 'posts',
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
export class PostModel extends BaseModel {
  @Column({ type: DataTypes.STRING })
  title: string;

  @Column({ type: DataTypes.STRING })
  description: number;

  @Column({
    type: DataTypes.ENUM,
    values: Object.values(PostStatus),
    defaultValue: PostStatus.inactive,
  })
  status: PostStatus;
}

export const postProviders = [
  {
    provide: POST_REPOSITORY,
    useValue: PostModel,
  },
];

export default PostModel;