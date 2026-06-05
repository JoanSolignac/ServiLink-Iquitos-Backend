import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { resolvePagination } from '@common/utils/pagination.util';
import { MY_SERVICE_SELECT } from '../types/my-service.type';
import { ListMyServicesInput } from '../types/list-my-services-input.type';
import { PaginatedMyServices } from '../types/paginated-my-services.type';

@Injectable()
export class ListMyServicesFeature {
  constructor(private readonly prisma: PrismaService) {}

  async execute(input: ListMyServicesInput): Promise<PaginatedMyServices> {
    const { skip, take } = resolvePagination(input.page, input.limit);

    const where: Prisma.ServiceWhereInput = {
      userId: input.userId,
    };

    if (input.status) {
      where.status = input.status;
    }

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

    const [myServices, total] = await this.prisma.$transaction([
      this.prisma.service.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        select: MY_SERVICE_SELECT,
      }),
      this.prisma.service.count({ where }),
    ]);

    return { myServices, total };
  }
}
