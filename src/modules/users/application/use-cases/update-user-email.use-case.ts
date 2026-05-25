import { Injectable } from '@nestjs/common';
import { UserFinderService } from '../services/user-finder.service';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserId } from '../../domain/value-objects/user-id.value-object';
import { UserEmail } from '../../domain/value-objects/user-email.value-object';
import { UserAlreadyExistsException } from '../../domain/exceptions/user-already-exists.exception';

@Injectable()
export class UpdateUserEmailUseCase {
  constructor(
    private readonly userFinderService: UserFinderService,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(id: UserId, email: UserEmail): Promise<void> {
    const user = await this.userFinderService.findById(id);

    const existsByEmail = await this.userRepository.findByEmail(email);

    if (existsByEmail && !existsByEmail.getId().equals(id)) {
      throw new UserAlreadyExistsException();
    }

    user.updateEmail(email);

    await this.userRepository.update(user);
  }
}
