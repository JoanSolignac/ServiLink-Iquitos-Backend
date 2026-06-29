import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { resolvePagination } from '@common/utils/pagination.util';
import { ReportedUserItemResponseDto } from '@modules/reports/dtos/response/reported-user-item.response.dto';
import { ReportedUsersPaginatedResponseDto } from '@modules/reports/dtos/response/reported-users-paginated.response.dto';

const WITH_PENDING_REPORTS = {
  OR: [
    { reportsAsTarget: { some: { status: 'PENDING' as const } } },
    {
      services: { some: { reports: { some: { status: 'PENDING' as const } } } },
    },
  ],
};

@Injectable()
export class ListReportedUsersFeature {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    page?: number,
    limit?: number,
  ): Promise<ReportedUsersPaginatedResponseDto> {
    const { skip, take } = resolvePagination(page, limit);

    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where: WITH_PENDING_REPORTS,
        include: {
          profile: true,
          _count: {
            select: {
              reportsAsTarget: { where: { status: 'PENDING' } },
            },
          },
        },
        skip,
        take,
      }),
      this.prisma.user.count({ where: WITH_PENDING_REPORTS }),
    ]);

    // For each user, count pending reports on their services
    const userIds = users.map((u) => u.id);
    const serviceReportsByOwner = await this.prisma.service.findMany({
      where: {
        userId: { in: userIds },
        reports: { some: { status: 'PENDING' } },
      },
      select: {
        userId: true,
        _count: { select: { reports: { where: { status: 'PENDING' } } } },
      },
    });

    const serviceCountPerOwner = new Map<string, number>();
    for (const s of serviceReportsByOwner) {
      const current = serviceCountPerOwner.get(s.userId) ?? 0;
      serviceCountPerOwner.set(s.userId, current + s._count.reports);
    }

    const data: ReportedUserItemResponseDto[] = users.map((u) => ({
      userId: u.id,
      fullName: u.profile
        ? `${u.profile.firstName} ${u.profile.lastName}`
        : u.email,
      profilePictureUrl: u.profile?.profilePictureUrl ?? null,
      email: u.email,
      pendingReportCount:
        u._count.reportsAsTarget + (serviceCountPerOwner.get(u.id) ?? 0),
    }));

    return {
      data,
      meta: { page: page ?? 1, limit: take, total },
    };
  }
}
