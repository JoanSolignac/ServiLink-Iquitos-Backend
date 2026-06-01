import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { User } from '@prisma/client';
import { UserEmailAlreadyExistsException } from '../exceptions/user-email-already-exists.exception';
import { ensureUserExistsById } from '@modules/users/utils/user.util';

@Injectable()
export class UpdateUserEmailFeature {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string, email: string): Promise<User> {
    await ensureUserExistsById(this.prisma, userId);

    const emailInUse = await this.prisma.user.findFirst({
      where: {
        email: email,
        NOT: { id: userId },
      },
    });

    if (emailInUse) {
      throw new UserEmailAlreadyExistsException();
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { email: email },
    });
  }
}
