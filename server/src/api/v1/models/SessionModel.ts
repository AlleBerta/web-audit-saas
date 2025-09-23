import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  DataType,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import type { SessionAttributes, SessionCreationAttributes } from './interfaces/session.interface';
type UserType = import('./UserModel').User;

@Table({ tableName: 'sessions', timestamps: true })
export class Session extends Model<SessionAttributes, SessionCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, allowNull: false })
  id!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  refreshToken!: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  revoked!: boolean;

  @Column({ type: DataType.DATE })
  expiresAt!: Date;

  @ForeignKey(() => require('./UserModel').User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId!: number;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => require('./UserModel').User)
  user!: UserType;
}
