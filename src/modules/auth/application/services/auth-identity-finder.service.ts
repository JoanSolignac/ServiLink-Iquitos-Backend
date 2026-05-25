import { Injectable } from '@nestjs/common';
import { AuthIdentityRepository } from '../../domain/repositories/auth-identity.repository';
import { AuthIdentityId } from '../../domain/value-objects/auth-identity-id.value-object';
import { UserId } from '../../../users/domain/value-objects/user-id.value-object';
import { AuthIdentity } from '../../domain/entities/auth-identity.entity';
import { AuthIdentityNotFoundException } from '../../domain/exceptions/auth-identity-not-found.exception';

@Injectable()
export class AuthIdentityFinderService {
  constructor(
    private readonly authIdentityRepository: AuthIdentityRepository,
  ) {}

  async findById(id: AuthIdentityId): Promise<AuthIdentity> {
    const authIdentity = await this.authIdentityRepository.findById(id);

    if (!authIdentity) {
      throw new AuthIdentityNotFoundException();
    }

    return authIdentity;
  }

  async findByUserId(id: UserId): Promise<AuthIdentity> {
    const authIdentity = await this.authIdentityRepository.findByUserId(id);

    if (!authIdentity) {
      throw new AuthIdentityNotFoundException();
    }

    return authIdentity;
  }
}
