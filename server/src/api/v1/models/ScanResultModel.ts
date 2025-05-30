// src/api/v1/models/ScanResult.ts
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  CreatedAt,
  BelongsTo,
} from 'sequelize-typescript';
import { Scan } from './ScanModel';

@Table({ tableName: 'scan_results' })
export class ScanResult extends Model<ScanResult> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @ForeignKey(() => Scan)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  scanId!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  vulnerabilityType!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  severity!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true, // campo opzionale
  })
  description?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true, // urlAffected opzionale
  })
  urlAffected?: string;

  @CreatedAt
  @Column({
    type: DataType.DATE,
  })
  createdAt!: Date;

  @BelongsTo(() => Scan)
  scan!: Scan;
}
