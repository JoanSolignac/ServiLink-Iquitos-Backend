import {
  User as PrismaUser,
  UserRole as PrismaUserRole,
  UserStatus as PrismaUserStatus,
} from '@prisma/client';
import { UserRole } from '../../domain/enums/user-role.enum';
import { UserStatus } from '../../domain/enums/user-status.enum';
import { User } from '../../domain/entities/user.entity';
import { UserId } from '../../domain/value-objects/user-id.value-object';
import { UserEmail } from '../../domain/value-objects/user-email.value-object';

export function toDomainRole(role: PrismaUserRole): UserRole {
  switch (role) {
    case 'USER':
      return UserRole.USER;

    case 'ADMINISTRATOR':
      return UserRole.ADMINISTRATOR;

    case 'MODERATOR':
      return UserRole.MODERATOR;
  }
}

export function toDomainStatus(status: PrismaUserStatus): UserStatus {
  switch (status) {
    case 'ACTIVE':
      return UserStatus.ACTIVE;

    case 'INACTIVE':
      return UserStatus.INACTIVE;

    case 'SUSPENDED':
      return UserStatus.SUSPENDED;
  }
}

export function toDomainUser(user: PrismaUser): User {
  return User.fromPersistence(
    UserId.from(user.id),
    UserEmail.from(user.email),
    toDomainRole(user.role),
    toDomainStatus(user.status),
    user.createdAt,
    user.updatedAt,
  );
}

export function toDomainUserList(users: PrismaUser[]): User[] {
  return users.map((u) => toDomainUser(u));
}

export function toPersistenceRole(role: UserRole): PrismaUserRole {
  switch (role) {
    case UserRole.USER:
      return PrismaUserRole.USER;

    case UserRole.ADMINISTRATOR:
      return PrismaUserRole.ADMINISTRATOR;

    case UserRole.MODERATOR:
      return PrismaUserRole.MODERATOR;
  }
}

export function toPersistenceStatus(status: UserStatus): PrismaUserStatus {
  switch (status) {
    case UserStatus.ACTIVE:
      return PrismaUserStatus.ACTIVE;

    case UserStatus.INACTIVE:
      return PrismaUserStatus.INACTIVE;

    case UserStatus.SUSPENDED:
      return PrismaUserStatus.SUSPENDED;
  }
}

export function toPersistenceUser(user: User): PrismaUser {
  return {
    id: user.getId().toPrimitives(),
    email: user.getEmail().toPrimitives(),
    role: toPersistenceRole(user.getRole()),
    status: toPersistenceStatus(user.getStatus()),
    createdAt: user.getCreatedAt(),
    updatedAt: user.getUpdatedAt(),
  };
}
