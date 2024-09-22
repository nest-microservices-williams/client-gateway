import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import type { AuthenticatedRequest } from 'src/common/interfaces';

export const Token = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = request.token;

    if (!token) {
      throw new InternalServerErrorException(
        "token not found in request object, make sure you're using the AuthGuard",
      );
    }

    return token;
  },
);
