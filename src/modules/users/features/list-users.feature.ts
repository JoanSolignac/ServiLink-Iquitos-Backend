import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { Prisma } from '@prisma/client';

import { resolvePagination } from '@common/utils/pagination.util';
import { USER_WITH_PROFILE_SELECT } from '../types/user-with-profile.type';
import { ListUsersInput } from '../types/list-users-input.type';
import { PaginatedUsers } from '../types/paginated-users.type';

@Injectable()
export class ListUsersFeature {
  constructor(private readonly prisma: PrismaService) {}

  async execute(input: ListUsersInput): Promise<PaginatedUsers> {
    const { skip, take } = resolvePagination(input.page, input.limit);

    const where: Prisma.UserWhereInput = {};

    if (input.search) {
      where.OR = [
        { email: { contains: input.search, mode: 'insensitive' } },
        {
          profile: {
            firstName: { contains: input.search, mode: 'insensitive' },
          },
        },
        {
          profile: {
            lastName: { contains: input.search, mode: 'insensitive' },
          },
        },
      ];
    }

    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        select: USER_WITH_PROFILE_SELECT,
      }),
      this.prisma.user.count({ where }),
    ]);

    return { users, total };
  }
}
