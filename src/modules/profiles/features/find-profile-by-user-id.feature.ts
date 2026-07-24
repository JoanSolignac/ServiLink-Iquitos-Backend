import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { Profile } from '@prisma/client';
import { ensureProfileNotExistsByUserId } from '@modules/profiles/utils/profile.util';

@Injectable()
export class FindProfileByUserIdFeature {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string): Promise<Profile & { overallRating: number }> {
    const [profile, ratingAgg] = await Promise.all([
      ensureProfileNotExistsByUserId(this.prisma, userId),
      this.prisma.rating.aggregate({
        where: { service: { userId } },
        _avg: { score: true },
      }),
    ]);

    return { ...profile, overallRating: ratingAgg._avg.score ?? 0 };
  }
}
