import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ReportNotFoundException } from '@modules/reports/exceptions/report-not-found.exception';
import { ReportReviewedEvent } from '@modules/reports/events/report-reviewed.event';
import { MarkReviewedResponseDto } from '@modules/reports/dtos/response/mark-reviewed.response.dto';

@Injectable()
export class MarkReportReviewedFeature {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(reportId: string): Promise<MarkReviewedResponseDto> {
    const report = await this.prisma.report.findUnique({
      where: { id: reportId },
      select: {
        id: true,
        reporter: {
          select: {
            email: true,
            profile: { select: { firstName: true, lastName: true } },
          },
        },
      },
    });

    if (!report) {
      throw new ReportNotFoundException();
    }

    const updated = await this.prisma.report.update({
      where: { id: reportId },
      data: { status: 'REVIEWED' },
      select: { id: true, status: true },
    });

    const reporter = report.reporter;
    const reporterName = reporter.profile
      ? `${reporter.profile.firstName} ${reporter.profile.lastName}`
      : reporter.email;

    await this.eventEmitter.emitAsync(
      ReportReviewedEvent.name,
      new ReportReviewedEvent(reporter.email, reporterName),
    );

    return { id: updated.id, status: updated.status };
  }
}
