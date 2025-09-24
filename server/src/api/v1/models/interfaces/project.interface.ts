export interface ProjectAttributes {
  id: number;
  userId: number;
  domain: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectCreationAttributes
  extends Omit<ProjectAttributes, 'id' | 'createdAt' | 'updatedAt'> {}
