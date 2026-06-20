import { Injectable } from '@nestjs/common';
import { ServiceStatus } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.service';
import { resolvePagination } from '@common/utils/pagination.util';
import { ProfileNotFoundException } from '@modules/profiles/exceptions/profile-not-found.exception';
import type {
  ProviderPublicProfileResponseDto,
  ServiceSummaryResponseDto,
} from '@modules/profiles/dtos/response/provider-public-profile.response.dto';

@Injectable()
export class GetProviderPublicProfileFeature {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    userId: string,
    page: number,
    limit: number,
  ): Promise<ProviderPublicProfileResponseDto> {
    const { skip, take } = resolvePagination(page, limit);

    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new ProfileNotFoundException();
    }

    const [ratingAgg, services, total] = await Promise.all([
      this.prisma.rating.aggregate({
        where: { service: { userId } },
        _avg: { score: true },
      }),
      this.prisma.service.findMany({
        where: { userId, status: ServiceStatus.APPROVED },
        orderBy: { averageRating: 'desc' },
        skip,
        take,
        select: {
          id: true,
          title: true,
          description: true,
          price: true,
          averageRating: true,
        },
      }),
      this.prisma.service.count({
        where: { userId, status: ServiceStatus.APPROVED },
      }),
    ]);

    const serviceSummaries: ServiceSummaryResponseDto[] = services.map((s) => ({
      serviceId: s.id,
      title: s.title,
      description: s.description,
      price: Number(s.price),
      averageRating: s.averageRating,
    }));

    return {
      userId: profile.userId,
      firstName: profile.firstName,
      lastName: profile.lastName,
      bio: profile.bio,
      phone: profile.phone,
      address: profile.address,
      profilePictureUrl: profile.profilePictureUrl,
      overallRating: ratingAgg._avg.score ?? 0,
      services: {
        data: serviceSummaries,
        total,
        page,
        limit,
      },
    };
  }
}
