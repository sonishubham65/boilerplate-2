import { Exclude } from 'class-transformer';
import sequelize from 'sequelize';
import { DataTypes } from 'sequelize';
import {
  Column,
  UpdatedAt,
  CreatedAt,
  DeletedAt,
  Table,
  Model,
} from 'sequelize-typescript';
@Table({
  version: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
})
export class BaseModel extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @CreatedAt
  @Exclude()
  @Column({
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize.fn('now'),
  })
  createdAt: Date;

  @UpdatedAt
  @Exclude()
  @Column({
    type: DataTypes.DATE,
    allowNull: true,
  })
  updatedAt: Date;

  @DeletedAt
  @Exclude()
  @Column({
    type: DataTypes.DATE,
    allowNull: true,
  })
  deletedAt: Date;
}
export const baseProvider = [
  {
    provide: 'BASE_REPOSITORY',
    useValue: BaseModel,
  },
];
