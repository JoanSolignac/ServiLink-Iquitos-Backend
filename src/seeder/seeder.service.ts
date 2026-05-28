import { Injectable, OnModuleInit } from '@nestjs/common';
import { User } from '../modules/users/domain/entities/user.entity';
import { TransactionManager } from '../shared/abstractions/transaction-manager.abstract';
import { IdGenerator } from '../shared/abstractions/id-generator.abstract';
import { UserId } from '../modules/users/domain/value-objects/user-id.value-object';
import { UserEmail } from '../modules/users/domain/value-objects/user-email.value-object';
import { UserRepository } from '../modules/users/domain/repositories/user.repository';

@Injectable()
export class SeederService implements OnModuleInit {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly transactionManager: TransactionManager,
    private readonly idGenerator: IdGenerator,
  ) {}

  async onModuleInit() {
    const admin = this.createAnAdministrator('joanpsolignac@gmail.com');
    const moderator = this.createAnModerator('joansolignaclovera@gmail.com');

    const existsAdmin = await this.userRepository.existsByEmail(
      admin.getEmail(),
    );

    if (!existsAdmin) {
      await this.userRepository.create(admin);
    }

    const existsModerator = await this.userRepository.existsByEmail(
      moderator.getEmail(),
    );

    if (!existsModerator) {
      await this.userRepository.create(moderator);
    }
  }

  private createAnAdministrator(email: string): User {
    const userId = UserId.from(this.idGenerator.generate());
    const userEmail = UserEmail.from(email);
    return User.createAnAdministrator(userId, userEmail);
  }

  private createAnModerator(email: string): User {
    const userId = UserId.from(this.idGenerator.generate());
    const userEmail = UserEmail.from(email);
    return User.createAModerator(userId, userEmail);
  }
}
