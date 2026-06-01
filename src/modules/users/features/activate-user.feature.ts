import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { User, UserStatus } from '@prisma/client';
import { UserAlreadyActiveException } from '../exceptions/user-already-active.exception';
import { ensureUserExistsById } from '@modules/users/utils/user.util';

@Injectable()
export class ActivateUserFeature {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string): Promise<User> {
    const user = await ensureUserExistsById(this.prisma, userId);

    if (user.status === UserStatus.ACTIVE) {
      throw new UserAlreadyActiveException();
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { status: UserStatus.ACTIVE },
    });
  }
}
