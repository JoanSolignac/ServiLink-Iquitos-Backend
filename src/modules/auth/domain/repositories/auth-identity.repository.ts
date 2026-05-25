import { AuthIdentity } from '../entities/auth-identity.entity';
import { AuthIdentityId } from '../value-objects/auth-identity-id.value-object';
import { UserId } from '../../../users/domain/value-objects/user-id.value-object';
import { ProviderId } from '../value-objects/provider-id.value-object';

export abstract class AuthIdentityRepository {
  abstract create(authIdentity: AuthIdentity): Promise<void>;
  abstract update(authIdentity: AuthIdentity): Promise<void>;
  abstract findByUserId(id: UserId): Promise<AuthIdentity | null>;
  abstract findByProviderId(
    providerId: ProviderId,
  ): Promise<AuthIdentity | null>;
  abstract findById(id: AuthIdentityId): Promise<AuthIdentity | null>;
}
