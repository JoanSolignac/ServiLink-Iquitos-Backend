import { Injectable } from '@nestjs/common';
import { UserFinderService } from '../services/user-finder.service';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserId } from '../../domain/value-objects/user-id.value-object';

@Injectable()
export class RestoreUserUseCase {
  constructor(
    private readonly userFinderService: UserFinderService,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(id: UserId): Promise<void> {
    const user = await this.userFinderService.findById(id);

    user.restore();

    await this.userRepository.save(user);
  }
}
