import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { Prisma, ServiceStatus } from '@prisma/client';
import { resolvePagination } from '@common/utils/pagination.util';
import { SERVICE_WITH_PROFILE_SELECT } from '../types/service-with-profile.type';
import { ListAdminServicesInput } from '../types/list-admin-services-input.type';
import { PaginatedServicesWithProfile } from '../types/paginated-services-with-profile.type';

@Injectable()
export class ListAdminServicesFeature {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    input: ListAdminServicesInput,
  ): Promise<PaginatedServicesWithProfile> {
    const { skip, take } = resolvePagination(input.page, input.limit);

    const where: Prisma.ServiceWhereInput = {
      status: ServiceStatus.REQUIRE_REVIEW,
    };

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
