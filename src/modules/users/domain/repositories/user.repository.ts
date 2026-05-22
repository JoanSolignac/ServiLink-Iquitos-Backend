import { UserId } from '../value-objects/user-id.value-object';
import { User } from '../entities/user.entity';
import { UserEmail } from '../value-objects/user-email.value-object';

export abstract class UserRepository {
  abstract save(user: User): Promise<void>;
  abstract findById(id: UserId): Promise<User | null>;
  abstract findByEmail(email: UserEmail): Promise<User | null>;
  abstract existsByEmail(email: UserEmail): Promise<boolean>;
}
