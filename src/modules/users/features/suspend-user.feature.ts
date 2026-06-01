import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { User, UserStatus } from '@prisma/client';
import { UserAlreadySuspendedException } from '../exceptions/user-already-suspended.exception';
import { ensureUserExistsById } from '@modules/users/utils/user.util';

@Injectable()
export class SuspendUserFeature {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string): Promise<User> {
    const user = await ensureUserExistsById(this.prisma, userId);

    if (user.status === UserStatus.SUSPENDED) {
      throw new UserAlreadySuspendedException();
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { status: UserStatus.SUSPENDED },
    });
  }
}
