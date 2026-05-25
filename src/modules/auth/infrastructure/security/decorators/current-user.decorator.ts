import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthCurrentUser } from '../../../domain/interfaces/auth-current-user.interface';
import { Request } from 'express';

export type AuthenticatedRequest = Request & {
  user: AuthCurrentUser;
};

export const CurrentUser = createParamDecorator(
  (_: unknown, context: ExecutionContext): AuthCurrentUser => {
    const authenticatedRequest = context
      .switchToHttp()
      .getRequest<AuthenticatedRequest>();
    return authenticatedRequest.user;
  },
);
