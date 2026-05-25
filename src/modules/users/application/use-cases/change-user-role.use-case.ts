import { Injectable } from '@nestjs/common';
import { UserFinderService } from '../services/user-finder.service';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserId } from '../../domain/value-objects/user-id.value-object';
import { UserRole } from '../../../../shared/enums/user-role.enum';

@Injectable()
export class ChangeUserRoleUseCase {
  constructor(
    private readonly userFinderService: UserFinderService,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(id: UserId, role: UserRole): Promise<void> {
    const user = await this.userFinderService.findById(id);

    user.updateRole(role);

    await this.userRepository.update(user);
  }
}
