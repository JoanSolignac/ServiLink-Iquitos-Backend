import { applyDecorators, UseGuards } from '@nestjs/common';
import { UserRole } from '../../../../../shared/enums/user-role.enum';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RoleGuard } from '../guards/role.guard';
import { Role } from './role.decorator';

export const UseAuth = (...roles: UserRole[]) =>
  applyDecorators(UseGuards(JwtAuthGuard, RoleGuard), Role(roles));
