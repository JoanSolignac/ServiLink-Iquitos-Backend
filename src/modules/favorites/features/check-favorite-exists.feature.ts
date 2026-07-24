import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class CheckFavoriteExistsFeature {
  constructor(private readonly prisma: PrismaService) {}

  async execute(serviceId: string, userId: string): Promise<boolean> {
    const favorite = await this.prisma.favorite.findUnique({
      where: { userId_serviceId: { userId, serviceId } },
      select: { userId: true },
    });
    return favorite !== null;
  }
}
