import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { UserReportsSummaryResponseDto } from '@modules/reports/dtos/response/user-reports-summary.response.dto';
import { ServiceReportItemResponseDto } from '@modules/reports/dtos/response/service-report-item.response.dto';

@Injectable()
export class GetUserReportsSummaryFeature {
  constructor(private readonly prisma: PrismaService) {}

  async execute(targetUserId: string): Promise<UserReportsSummaryResponseDto> {
    const [profileReports, serviceGroups] = await Promise.all([
      this.prisma.report.findMany({
        where: { targetUserId, typeReport: 'USER' },
        include: { reporter: { include: { profile: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.service.findMany({
        where: {
          userId: targetUserId,
          reports: { some: { status: 'PENDING' } },
        },
        select: {
          id: true,
          title: true,
          _count: { select: { reports: { where: { status: 'PENDING' } } } },
        },
      }),
    ]);

    const profileReportDtos: ServiceReportItemResponseDto[] =
      profileReports.map((r) => ({
        id: r.id,
        subject: r.subject,
        description: r.description,
        status: r.status,
        createdAt: r.createdAt,
        reporterFullName: r.reporter.profile
          ? `${r.reporter.profile.firstName} ${r.reporter.profile.lastName}`
          : r.reporter.email,
        reporterPictureUrl: r.reporter.profile?.profilePictureUrl ?? null,
      }));

    return {
      profileReports: profileReportDtos,
      serviceGroups: serviceGroups.map((s) => ({
        serviceId: s.id,
        serviceTitle: s.title,
        pendingReportCount: s._count.reports,
      })),
    };
  }
}
