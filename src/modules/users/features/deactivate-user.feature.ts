import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { User, UserStatus } from '@prisma/client';
import { UserAlreadyInactiveException } from '../exceptions/user-already-inactive.exception';
import { ensureUserExistsById } from '@modules/users/utils/user.util';

@Injectable()
export class DeactivateUserFeature {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string): Promise<User> {
    const user = await ensureUserExistsById(this.prisma, userId);

    if (user.status === UserStatus.INACTIVE) {
      throw new UserAlreadyInactiveException();
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { status: UserStatus.INACTIVE },
    });
  }
}
