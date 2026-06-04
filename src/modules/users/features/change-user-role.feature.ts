import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { User, UserRole } from '@prisma/client';

import { ensureUserExistsById } from '../../../common/utils/ensureUserExistsById.utils';

@Injectable()
export class ChangeUserRoleFeature {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string, role: UserRole): Promise<User> {
    await ensureUserExistsById(this.prisma, userId);

    return this.prisma.user.update({
      where: { id: userId },
      data: { role: role },
    });
  }
}
