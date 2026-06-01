import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { Service, Prisma, ServiceStatus } from '@prisma/client';
import { resolvePagination } from '@common/utils/pagination.util';

type ListAdminServicesInput = {
  page: number;
  limit: number;
};

@Injectable()
export class ListAdminServicesFeature {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    input: ListAdminServicesInput,
  ): Promise<{ services: Service[]; total: number }> {
    const { skip, take } = resolvePagination(input.page, input.limit);

    const where: Prisma.ServiceWhereInput = {
      status: ServiceStatus.REQUIRE_REVIEW,
    };

    const [services, total] = await Promise.all([
      this.prisma.service.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.service.count({ where }),
    ]);

    return { services, total };
  }
}
