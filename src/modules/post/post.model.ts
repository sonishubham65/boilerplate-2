import * as _ from 'lodash';
import { BelongsTo, Column, Table } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { BaseModel } from '../base.model';
import { POST_REPOSITORY } from '../database/database.constant';
import UserModel from '../user/user.model';

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
      fields: ['status'],
    },
  ],
})
export class PostModel extends BaseModel {
  @Column({ type: DataTypes.STRING })
  title: string;

  @Column({ type: DataTypes.STRING })
  description: string;

  @BelongsTo(() => UserModel, 'userId')
  user: UserModel;

  userId: number;

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
