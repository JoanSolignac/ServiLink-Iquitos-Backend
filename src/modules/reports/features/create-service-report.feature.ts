import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ReportTargetNotFoundException } from '@modules/reports/exceptions/report-target-not-found.exception';
import { ReportCooldownActiveException } from '@modules/reports/exceptions/report-cooldown-active.exception';
import { ReportCreatedEvent } from '@modules/reports/events/report-created.event';
import { UserReportThresholdReachedEvent } from '@modules/reports/events/user-report-threshold-reached.event';
import { UserRole } from '@prisma/client';

const REPORT_WARNING_THRESHOLD = 5;

const COOLDOWN_MS = 24 * 60 * 60 * 1000;

@Injectable()
export class CreateServiceReportFeature {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(
    reporterId: string,
    serviceId: string,
    subject: string,
    description: string | undefined,
  ): Promise<void> {
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
      select: { id: true, userId: true },
    });

    if (!service) {
      throw new ReportTargetNotFoundException();
    }

    const lastReport = await this.prisma.report.findFirst({
      where: { reporterId, serviceId, typeReport: 'SERVICE' },
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true },
    });

    if (
      lastReport &&
      lastReport.createdAt.getTime() > Date.now() - COOLDOWN_MS
    ) {
      throw new ReportCooldownActiveException();
    }

    await this.prisma.report.create({
      data: {
        reporterId,
        serviceId,
        subject,
        description: description ?? '',
        typeReport: 'SERVICE',
        status: 'PENDING',
      },
    });

    const [reporter, moderators] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: reporterId },
        select: {
          email: true,
          profile: { select: { firstName: true, lastName: true } },
        },
      }),
      this.prisma.user.findMany({
        where: { role: { in: [UserRole.MODERATOR, UserRole.ADMINISTRATOR] } },
        select: {
          email: true,
          profile: { select: { firstName: true, lastName: true } },
          devices: { select: { fcmToken: true } },
        },
      }),
    ]);

    const reporterName = reporter?.profile
      ? `${reporter.profile.firstName} ${reporter.profile.lastName}`
      : (reporter?.email ?? '');

    const moderatorEmails = moderators
      .filter((m) => m.profile)
      .map((m) => ({
        name: `${m.profile!.firstName} ${m.profile!.lastName}`,
        email: m.email,
      }));

    const moderatorFcmTokens = moderators.flatMap((m) =>
      m.devices.map((d) => d.fcmToken),
    );

    await this.eventEmitter.emitAsync(
      ReportCreatedEvent.name,
      new ReportCreatedEvent(
        reporter?.email ?? '',
        reporterName,
        moderatorEmails,
        moderatorFcmTokens,
      ),
    );

    await this.checkAndNotifyThreshold(service.userId);
  }

  private async checkAndNotifyThreshold(targetUserId: string): Promise<void> {
    const [profileCount, serviceCount] = await Promise.all([
      this.prisma.report.count({ where: { targetUserId, status: 'PENDING' } }),
      this.prisma.report.count({
        where: {
          typeReport: 'SERVICE',
          status: 'PENDING',
          service: { userId: targetUserId },
        },
      }),
    ]);

    if (profileCount + serviceCount > REPORT_WARNING_THRESHOLD) {
      const target = await this.prisma.user.findUnique({
        where: { id: targetUserId },
        select: {
          email: true,
          profile: { select: { firstName: true, lastName: true } },
        },
      });

      if (target) {
        const targetName = target.profile
          ? `${target.profile.firstName} ${target.profile.lastName}`
          : target.email;

        await this.eventEmitter.emitAsync(
          UserReportThresholdReachedEvent.name,
          new UserReportThresholdReachedEvent(target.email, targetName),
        );
      }
    }
  }
}
