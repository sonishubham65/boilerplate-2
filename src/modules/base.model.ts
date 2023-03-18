import sequelize from 'sequelize';
import { UUIDV4 } from 'sequelize';
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
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
    allowNull: false,
  })
  id: string | number;

  @CreatedAt
  @Column({
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize.fn('now'),
  })
  created_at: Date;

  @UpdatedAt
  @Column({
    type: DataTypes.DATE,
    allowNull: true,
  })
  updated_at: Date;

  @DeletedAt
  @Column({
    type: DataTypes.DATE,
    allowNull: true,
  })
  deleted_at: Date;
}
export const baseProvider = [
  {
    provide: 'BASE_REPOSITORY',
    useValue: BaseModel,
  },
];
