import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '@prisma/prisma.service';
import { ServiceStatus, UserStatus } from '@prisma/client';

@Injectable()
export class RestoreExpiredBansJob {
  private readonly logger = new Logger(RestoreExpiredBansJob.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron('0 * * * *')
  async run(): Promise<void> {
    const now = new Date();
    this.logger.log('Running restore-expired-bans job');

    await this.restoreExpiredUsers(now);
    await this.restoreExpiredServices(now);

    this.logger.log('Restore-expired-bans job completed');
  }

  private async restoreExpiredUsers(now: Date): Promise<void> {
    const expiredUsers = await this.prisma.user.findMany({
      where: { status: UserStatus.SUSPENDED, bannedUntil: { lte: now } },
      select: { id: true },
    });

    if (expiredUsers.length === 0) return;

    this.logger.log(`Restoring ${expiredUsers.length} expired banned user(s)`);

    for (const user of expiredUsers) {
      await this.prisma.$transaction([
        this.prisma.user.update({
          where: { id: user.id },
          data: { status: UserStatus.ACTIVE, bannedUntil: null },
        }),
        this.prisma.service.updateMany({
          where: {
            userId: user.id,
            status: ServiceStatus.DISABLED,
            disabledUntil: null,
          },
          data: { status: ServiceStatus.REQUIRE_REVIEW },
        }),
      ]);
    }
  }

  private async restoreExpiredServices(now: Date): Promise<void> {
    const result = await this.prisma.service.updateMany({
      where: {
        status: ServiceStatus.DISABLED,
        disabledUntil: { lte: now },
      },
      data: { status: ServiceStatus.REQUIRE_REVIEW, disabledUntil: null },
    });

    if (result.count > 0) {
      this.logger.log(`Restored ${result.count} expired disabled service(s)`);
    }
  }
}
