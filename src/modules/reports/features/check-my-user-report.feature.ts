import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { HasReportResponseDto } from '@modules/reports/dtos/response/has-report.response.dto';

const COOLDOWN_MS = 24 * 60 * 60 * 1000;

@Injectable()
export class CheckMyUserReportFeature {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    reporterId: string,
    targetUserId: string,
  ): Promise<HasReportResponseDto> {
    const report = await this.prisma.report.findFirst({
      where: { reporterId, targetUserId, typeReport: 'USER' },
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true },
    });

    const hasReport =
      report !== null && report.createdAt.getTime() > Date.now() - COOLDOWN_MS;

    return { hasReport };
  }
}
