import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { User } from '@prisma/client';

import { ensureUserExistsById } from '../../../common/utils/ensureUserExistsById.utils';

@Injectable()
export class FindUserByIdFeature {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string): Promise<User> {
    return ensureUserExistsById(this.prisma, userId);
  }
}
