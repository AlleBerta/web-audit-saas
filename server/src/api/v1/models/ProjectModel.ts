import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
  HasMany,
} from 'sequelize-typescript';
import { User } from './UserModel';
import { ProjectAttributes, ProjectCreationAttributes } from './interfaces/project.interface';
import { Target } from './TargetModel';
import { CreationOptional } from 'sequelize';
@Table({ tableName: 'projects' })
export class Project extends Model<ProjectAttributes, ProjectCreationAttributes> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  })
  id!: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @CreatedAt
  @Column({
    allowNull: false,
  })
  createdAt!: Date;

  @UpdatedAt
  @Column({
    allowNull: false,
  })
  updatedAt!: Date;

  @BelongsTo(() => User)
  users!: User;

  // Relazione con targets (1 project -> N Targets)
  @HasMany(() => Target, { onDelete: 'CASCADE' })
  targets?: Target[];
}
