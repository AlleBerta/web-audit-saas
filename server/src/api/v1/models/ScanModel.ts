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
import { Target } from './TargetModel';
import { ScanResult } from './ScanResultModel';

@Table({ tableName: 'scans' })
export class Scan extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @ForeignKey(() => Target)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'targetId',
  })
  targetId!: number;

  @Column({
    type: DataType.ENUM('pending', 'running', 'done', 'failed', 'canceled', 'none'),
    allowNull: false,
    field: 'state',
    defaultValue: 'none',
  })
  state!: 'pending' | 'running' | 'done' | 'failed' | 'canceled' | 'none';

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

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'pentest_path',
  })
  pentestPath?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => Target)
  target!: Target;

  // Relazione con scanResults (1 scan -> N scanResults)
  @HasMany(() => ScanResult, { onDelete: 'CASCADE' })
  scanResults?: ScanResult[];
}
