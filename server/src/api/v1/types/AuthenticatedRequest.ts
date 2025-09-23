import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    name: string;
    surname: string;
    role: string;
  };
}
