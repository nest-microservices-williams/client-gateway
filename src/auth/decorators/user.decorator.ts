import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import type { AuthenticatedRequest } from 'src/common/interfaces';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user) {
      throw new InternalServerErrorException(
        "User not found in request object, make sure you're using the AuthGuard",
      );
    }

    return user;
  },
);
