import { Injectable } from '@nestjs/common';
import { UserFinderService } from '../services/user-finder.service';
import { UserId } from '../../domain/value-objects/user-id.value-object';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class FindUserByIdUseCase {
  constructor(private readonly userFinderService: UserFinderService) {}

  async execute(id: UserId): Promise<User> {
    return this.userFinderService.findById(id);
  }
}
