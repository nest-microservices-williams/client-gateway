import { FastifyRequest } from 'fastify';
import { AuthenticatedUser } from './';

export interface AuthenticatedRequest extends FastifyRequest {
  user: AuthenticatedUser;
  token: string;
}
