import { Injectable } from '@nestjs/common';
import { AuthIdentityRepository } from '../../domain/repositories/auth-identity.repository';
import { UserRepository } from '../../../users/domain/repositories/user.repository';
import { IdGenerator } from '../../../../shared/abstractions/id-generator.abstract';
import { TransactionManager } from '../../../../shared/abstractions/transaction-manager.abstract';
import { ProviderId } from '../../domain/value-objects/provider-id.value-object';
import { UserEmail } from '../../../users/domain/value-objects/user-email.value-object';
import { AuthProvider } from '../../domain/value-objects/auth-provider.value-object';
import { UserId } from '../../../users/domain/value-objects/user-id.value-object';
import { User } from '../../../users/domain/entities/user.entity';
import { AuthIdentityId } from '../../domain/value-objects/auth-identity-id.value-object';
import { AuthIdentity } from '../../domain/entities/auth-identity.entity';

@Injectable()
export class SyncUserUseCase {
  constructor(
    private readonly authIdentityRepository: AuthIdentityRepository,
    private readonly userRepository: UserRepository,
    private readonly idGenerator: IdGenerator,
    private readonly transactionManager: TransactionManager,
  ) {}

  async execute(
    providerId: ProviderId,
    userEmail: UserEmail,
    provider: AuthProvider,
  ): Promise<User> {
    // Buscar identidad existente
    const existingIdentity =
      await this.authIdentityRepository.findByProviderId(providerId);

    if (existingIdentity) {
      return this.userRepository.findByIdOrThrow(existingIdentity.getUserId());
    }

    // Buscar usuario por email
    const existingUser = await this.userRepository.findByEmail(userEmail);

    // Usuario existente → agregar nuevo método de login
    if (existingUser) {
      const authIdentity = this.createAuthIdentity(
        existingUser.getId(),
        provider,
        providerId,
      );

      await this.transactionManager.execute(async (): Promise<void> => {
        await this.authIdentityRepository.create(authIdentity);
      });

      return existingUser;
    }

    // Usuario completamente nuevo
    const user = this.createUser(userEmail);

    const authIdentity = this.createAuthIdentity(
      user.getId(),
      provider,
      providerId,
    );

    await this.transactionManager.execute(async (): Promise<void> => {
      await this.userRepository.create(user);

      await this.authIdentityRepository.create(authIdentity);
    });

    return user;
  }

  private createAuthIdentity(
    userId: UserId,
    provider: AuthProvider,
    providerId: ProviderId,
  ): AuthIdentity {
    return AuthIdentity.create(
      AuthIdentityId.from(this.idGenerator.generate()),
      userId,
      provider,
      providerId,
    );
  }

  private createUser(userEmail: UserEmail): User {
    return User.create(UserId.from(this.idGenerator.generate()), userEmail);
  }
}
