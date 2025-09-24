export interface TargetAttributes {
  id: number;
  projectId: number;
  domain: string;
  ip_domain: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TargetCreationAttributes
  extends Omit<TargetAttributes, 'id' | 'createdAt' | 'updatedAt'> {}
