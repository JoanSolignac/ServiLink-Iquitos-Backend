import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { User, UserRole } from '@prisma/client';

import { ensureUserExistsById } from '../../../common/utils/ensureUserExistsById.utils';
import { UserAlreadyHasRoleException } from '../exceptions/user-already-has-role.exception';

@Injectable()
export class ChangeUserRoleFeature {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string, role: UserRole): Promise<User> {
    const user = await ensureUserExistsById(this.prisma, userId);

    if (user.role === role) {
      throw new UserAlreadyHasRoleException();
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { role },
    });
  }
}
