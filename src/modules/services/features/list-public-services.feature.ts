import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { Service, Prisma, ServiceStatus } from '@prisma/client';
import { resolvePagination } from '@common/utils/pagination.util';

type ListPublicServicesInput = {
  search?: string;
  page?: number;
  limit?: number;
};

@Injectable()
export class ListPublicServicesFeature {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    input: ListPublicServicesInput,
  ): Promise<{ services: Service[]; total: number }> {
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
