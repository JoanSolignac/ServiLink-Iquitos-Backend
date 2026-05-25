import { AuthIdentityId } from '../value-objects/auth-identity-id.value-object';
import { UserId } from '../../../users/domain/value-objects/user-id.value-object';
import { AuthProvider } from '../value-objects/auth-provider.value-object';
import { ProviderId } from '../value-objects/provider-id.value-object';

export class AuthIdentity {
  private constructor(
    private readonly id: AuthIdentityId,
    private readonly userId: UserId,
    private readonly provider: AuthProvider,
    private readonly providerId: ProviderId,
    private readonly createdAt: Date,
    private updatedAt: Date,
  ) {}

  static create(
    id: AuthIdentityId,
    userId: UserId,
    provider: AuthProvider,
    providerId: ProviderId,
  ): AuthIdentity {
    const now = new Date();
    return new AuthIdentity(id, userId, provider, providerId, now, now);
  }

  static fromPersistence(
    id: AuthIdentityId,
    userId: UserId,
    provider: AuthProvider,
    providerId: ProviderId,
    createdAt: Date,
    updatedAt: Date,
  ): AuthIdentity {
    return new AuthIdentity(
      id,
      userId,
      provider,
      providerId,
      createdAt,
      updatedAt,
    );
  }

  getId(): AuthIdentityId {
    return this.id;
  }

  getUserId(): UserId {
    return this.userId;
  }

  getProvider(): AuthProvider {
    return this.provider;
  }

  getProviderId(): ProviderId {
    return this.providerId;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  equals(other: AuthIdentity): boolean {
    return this.getId().equals(other.getId());
  }

  private touch(): void {
    this.updatedAt = new Date();
  }
}
