import { UserId } from '../../../users/domain/value-objects/user-id.value-object';
import { Profile } from '../entities/profile.entity';

export abstract class ProfileRepository {
  abstract create(profile: Profile): Promise<void>;
  abstract update(profile: Profile): Promise<void>;
  abstract findByUserId(userId: UserId): Promise<Profile | null>;
  abstract findByUserIdOrThrow(userId: UserId): Promise<Profile>;
  abstract existsByUserId(userId: UserId): Promise<boolean>;
}
