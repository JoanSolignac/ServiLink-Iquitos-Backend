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

    await this.transactionManager.execute(async (): Promise<void> => {
      await this.userRepository.upsert(admin);
      await this.userRepository.upsert(moderator);
    });
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
