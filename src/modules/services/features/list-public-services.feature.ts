import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { Prisma, ServiceStatus } from '@prisma/client';
import { resolvePagination } from '@common/utils/pagination.util';
import { ListPublicServicesInput } from '../types/list-public-services-input.type';
import { SERVICE_WITH_PROFILE_SELECT } from '../types/service-with-profile.type';
import { PaginatedServicesWithProfile } from '../types/paginated-services-with-profile.type';

@Injectable()
export class ListPublicServicesFeature {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    input: ListPublicServicesInput,
  ): Promise<PaginatedServicesWithProfile> {
    const { skip, take } = resolvePagination(input.page, input.limit);

    const where: Prisma.ServiceWhereInput = {
      status: ServiceStatus.APPROVED,
    };

    if (input.search) {
      where.OR = [
        {
          title: {
            contains: input.search,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: input.search,
            mode: 'insensitive',
          },
        },
        {
          keywords: {
            has: input.search,
          },
        },
      ];
    }

    const [servicesUserProfile, total] = await this.prisma.$transaction([
      this.prisma.service.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        select: SERVICE_WITH_PROFILE_SELECT,
      }),
      this.prisma.service.count({ where }),
    ]);

    return { servicesUserProfile, total };
  }
}
