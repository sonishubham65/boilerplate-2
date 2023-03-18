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

export enum UserStatus {
  active = 'active',
  inactive = 'inactive',
}

@Table({
  modelName: 'user',
  indexes: [
    {
      fields: ['first_name', 'middle_name', 'last_name'],
    },
    {
      fields: ['email'],
      unique: true,
    },
  ],
})
export class UserModel extends BaseModel {
  @Column({ type: DataTypes.CHAR })
  name: string;

  @Column({ type: DataTypes.CHAR })
  email: string;

  @Column({ type: DataTypes.CHAR })
  @Exclude()
  password: string = '';

  @Column({ type: DataTypes.CHAR })
  @Exclude()
  salt: string;

  @Column({
    type: DataTypes.ENUM,
    values: Object.values(UserStatus),
    defaultValue: UserStatus.inactive,
  })
  status: UserStatus;

  @Column({
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  })
  emailVerified: Boolean = false;
}

export const userProvider = [
  {
    provide: 'USER_REPOSITORY',
    useValue: UserModel,
  },
];

export default UserModel;
