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
import { Project } from './ProjectModel';
import { Scan } from './ScanModel'; // lo aggiungeremo dopo
import { TargetAttributes, TargetCreationAttributes } from './interfaces/target.interface';
import { CreationOptional } from 'sequelize';

@Table({
  tableName: 'targets',
  indexes: [
    {
      unique: true,
      fields: ['projectId', 'domain'],
    },
  ],
})
export class Target extends Model<TargetAttributes, TargetCreationAttributes> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @ForeignKey(() => Project)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'projectId',
  })
  projectId!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  domain!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  ip_domain?: string;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt!: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt!: Date;

  @BelongsTo(() => Project)
  project!: Project;

  // Relazione con scans (1 target -> N scansioni)
  @HasMany(() => Scan, { onDelete: 'CASCADE' })
  scans!: Scan[];
}
