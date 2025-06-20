// src/models/Scan.ts
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
import { ScanResult } from './ScanResultModel';
import { ScanAttributes, ScanCreationAttributes } from './interfaces/scan.interface';

@Table({ tableName: 'scans' })
export class Scan extends Model<ScanAttributes, ScanCreationAttributes> {
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
    field: 'project_id',
  })
  projectId!: number;

  @BelongsTo(() => Project)
  project!: Project;

  @Column({
    type: DataType.ENUM('pending', 'running', 'done', 'failed'),
    allowNull: false,
  })
  state!: 'pending' | 'running' | 'done' | 'failed';

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'start_time',
  })
  startTime?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'end_time',
  })
  endTime?: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'report_path',
  })
  reportPath?: string;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt!: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt!: Date;

  @BelongsTo(() => Project)
  projects!: Project[];

  @HasMany(() => ScanResult, { onDelete: 'CASCADE' })
  scanResults?: ScanResult[];
}
