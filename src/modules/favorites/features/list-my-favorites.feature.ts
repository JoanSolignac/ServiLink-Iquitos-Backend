import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.service';
import { resolvePagination } from '@common/utils/pagination.util';
import type { FavoriteServicePaginatedResponseDto } from '@modules/favorites/dtos/response/favorite-service-paginated.response.dto';
import type { FavoriteServiceResponseDto } from '@modules/favorites/dtos/response/favorite-service.response.dto';

const FAVORITE_SERVICE_SELECT = {
  service: {
    select: {
      id: true,
      title: true,
      description: true,
      keywords: true,
      price: true,
      status: true,
      averageRating: true,
      user: {
        select: {
          profile: {
            select: {
              firstName: true,
              profilePictureUrl: true,
            },
          },
        },
      },
    },
  },
} satisfies Prisma.FavoriteSelect;

@Injectable()
export class ListMyFavoritesFeature {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    userId: string,
    page: number,
    limit: number,
  ): Promise<FavoriteServicePaginatedResponseDto> {
    const { skip, take } = resolvePagination(page, limit);

    const [favorites, total] = await this.prisma.$transaction([
      this.prisma.favorite.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        select: FAVORITE_SERVICE_SELECT,
      }),
      this.prisma.favorite.count({ where: { userId } }),
    ]);

    const data: FavoriteServiceResponseDto[] = favorites.map((f) => ({
      serviceId: f.service.id,
      title: f.service.title,
      description: f.service.description,
      keywords: f.service.keywords,
      price: f.service.price.toNumber(),
      status: f.service.status,
      providerName: f.service.user.profile?.firstName ?? '',
      providerPictureUrl:
        f.service.user.profile?.profilePictureUrl ?? undefined,
      averageRating: f.service.averageRating,
    }));

    return { data, meta: { page, limit, total } };
  }
}
