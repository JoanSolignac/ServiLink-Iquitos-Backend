import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { User } from '@prisma/client';
import { ensureUserExistsByEmail } from '@common/utils/utils/user.util';

@Injectable()
export class FindUserByEmailFeature {
  constructor(private readonly prisma: PrismaService) {}

  async execute(email: string): Promise<User | null> {
    return ensureUserExistsByEmail(this.prisma, email);
  }
}
