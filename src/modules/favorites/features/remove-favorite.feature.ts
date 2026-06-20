import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { FavoriteNotFoundException } from '@modules/favorites/exceptions/favorite-not-found.exception';

@Injectable()
export class RemoveFavoriteFeature {
  constructor(private readonly prisma: PrismaService) {}

  async execute(serviceId: string, userId: string): Promise<void> {
    const existing = await this.prisma.favorite.findUnique({
      where: { userId_serviceId: { userId, serviceId } },
      select: { userId: true },
    });

    if (!existing) {
      throw new FavoriteNotFoundException();
    }

    await this.prisma.favorite.delete({
      where: { userId_serviceId: { userId, serviceId } },
    });
  }
}
