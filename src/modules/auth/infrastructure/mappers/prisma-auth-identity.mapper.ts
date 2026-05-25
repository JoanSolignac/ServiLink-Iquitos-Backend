import { AuthIdentity as PrismaAuthIdentity } from '@prisma/client';
import { AuthProvider } from '../../domain/value-objects/auth-provider.value-object';
import { AuthIdentity } from '../../domain/entities/auth-identity.entity';
import { AuthIdentityId } from '../../domain/value-objects/auth-identity-id.value-object';
import { UserId } from '../../../users/domain/value-objects/user-id.value-object';
import { ProviderId } from '../../domain/value-objects/provider-id.value-object';

export function toDomainAuthIdentity(
  authIdentity: PrismaAuthIdentity,
): AuthIdentity {
  return AuthIdentity.fromPersistence(
    AuthIdentityId.from(authIdentity.id),
    UserId.from(authIdentity.userId),
    AuthProvider.fromPersistence(authIdentity.provider),
    ProviderId.from(authIdentity.providerId),
    authIdentity.createdAt,
    authIdentity.updatedAt,
  );
}

export function toPersistenceAuthIdentity(
  authIdentity: AuthIdentity,
): Omit<PrismaAuthIdentity, 'user'> {
  return {
    id: authIdentity.getId().toPrimitives(),
    userId: authIdentity.getUserId().toPrimitives(),
    provider: authIdentity.getProvider().getValue(),
    providerId: authIdentity.getProviderId()?.toPrimitives() ?? null,
    createdAt: authIdentity.getCreatedAt(),
    updatedAt: authIdentity.getUpdatedAt(),
  };
}
