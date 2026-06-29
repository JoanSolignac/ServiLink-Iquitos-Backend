import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { resolvePagination } from '@common/utils/pagination.util';
import { ServiceReportItemResponseDto } from '@modules/reports/dtos/response/service-report-item.response.dto';
import { ServiceReportsPaginatedResponseDto } from '@modules/reports/dtos/response/service-reports-paginated.response.dto';

@Injectable()
export class ListServiceReportsFeature {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    serviceId: string,
    page?: number,
    limit?: number,
  ): Promise<ServiceReportsPaginatedResponseDto> {
    const { skip, take } = resolvePagination(page, limit);

    const [reports, total] = await this.prisma.$transaction([
      this.prisma.report.findMany({
        where: { serviceId, typeReport: 'SERVICE' },
        include: { reporter: { include: { profile: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.report.count({ where: { serviceId, typeReport: 'SERVICE' } }),
    ]);

    const data: ServiceReportItemResponseDto[] = reports.map((r) => ({
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
      data,
      meta: { page: page ?? 1, limit: take, total },
    };
  }
}
