import { Injectable } from '@nestjs/common';
import { ServiceStatus } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.service';
import { FavoriteAlreadyExistsException } from '@modules/favorites/exceptions/favorite-already-exists.exception';
import { FavoriteNotAllowedException } from '@modules/favorites/exceptions/favorite-not-allowed.exception';

@Injectable()
export class AddFavoriteFeature {
  constructor(private readonly prisma: PrismaService) {}

  async execute(serviceId: string, userId: string): Promise<void> {
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
      select: { id: true, userId: true, status: true },
    });

    if (!service || service.status !== ServiceStatus.APPROVED) {
      throw new FavoriteNotAllowedException(
        'Service not found or not available',
      );
    }

    if (service.userId === userId) {
      throw new FavoriteNotAllowedException(
        'You cannot add your own service to favorites',
      );
    }

    const existing = await this.prisma.favorite.findUnique({
      where: { userId_serviceId: { userId, serviceId } },
      select: { userId: true },
    });

    if (existing) {
      throw new FavoriteAlreadyExistsException();
    }

    await this.prisma.favorite.create({
      data: { userId, serviceId },
    });
  }
}
