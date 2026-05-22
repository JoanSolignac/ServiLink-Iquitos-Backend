import { Injectable } from '@nestjs/common';
import { UserFinderService } from '../services/user-finder.service';
import { UserEmail } from '../../domain/value-objects/user-email.value-object';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class FindUserByEmailUseCase {
  constructor(private readonly userFinderService: UserFinderService) {}

  async execute(email: UserEmail): Promise<User> {
    return this.userFinderService.findByEmail(email);
  }
}
