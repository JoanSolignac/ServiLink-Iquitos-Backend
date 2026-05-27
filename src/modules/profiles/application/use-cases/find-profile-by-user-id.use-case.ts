import { Injectable } from '@nestjs/common';
import { ProfileRepository } from '../../domain/repositories/profile.repository';
import { UserId } from '../../../users/domain/value-objects/user-id.value-object';
import { Profile } from '../../domain/entities/profile.entity';

@Injectable()
export class FindProfileByUserIdUseCase {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async execute(userId: UserId): Promise<Profile | null> {
    return this.profileRepository.findByUserId(userId);
  }
}
