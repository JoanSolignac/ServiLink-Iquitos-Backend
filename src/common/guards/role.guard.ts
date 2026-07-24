import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { ROLE_KEY } from '../decorators/role.decorator';
import { AuthenticatedRequest } from '../decorators/current-user.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  private readonly logger = new Logger(RoleGuard.name);

  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLE_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const authenticatedRequest = context
      .switchToHttp()
      .getRequest<AuthenticatedRequest>();

    const userRole = authenticatedRequest.user.role;

    this.logger.log(
      `RoleGuard check: requiredRoles=[${requiredRoles.join(',')}], userRole=${userRole}`,
    );

    if (!userRole) {
      this.logger.warn('RoleGuard denied: user has no role');
      return false;
    }

    const allowed = requiredRoles.includes(userRole);

    if (!allowed) {
      this.logger.warn(
        `RoleGuard denied: userRole=${userRole} not in requiredRoles`,
      );
    }

    return allowed;
  }
}
