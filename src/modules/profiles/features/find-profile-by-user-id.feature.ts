import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { Profile } from '@prisma/client';
import { ensureProfileNotExistsByUserId } from '@modules/profiles/utils/profile.util';

@Injectable()
export class FindProfileByUserIdFeature {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string): Promise<Profile> {
    return ensureProfileNotExistsByUserId(this.prisma, userId);
  }
}
