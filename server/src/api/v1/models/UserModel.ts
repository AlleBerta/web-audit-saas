import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Unique,
  Default,
  CreatedAt,
  UpdatedAt,
  HasMany,
} from 'sequelize-typescript';

import { CreationOptional } from 'sequelize';

import { Project } from './ProjectModel';

@Table({ tableName: 'users', timestamps: true })
export class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  id!: CreationOptional<number>; // è opzionale al momento della creazione

  @Unique
  @AllowNull(false)
  @Column({ type: DataType.STRING })
  email!: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  name!: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  surname!: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  password!: string;

  @AllowNull(false)
  @Default('user') // valore di default 'user'
  @Column({ type: DataType.STRING })
  role!: string;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt!: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt!: Date;

  @HasMany(() => Project, { onDelete: 'CASCADE' })
  projects?: CreationOptional<Project[]>; // projects è la proprietà per ricavare tutti i progetto collegato ad un utente
}
