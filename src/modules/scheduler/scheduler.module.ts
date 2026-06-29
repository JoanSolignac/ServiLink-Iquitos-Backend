import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from '@prisma/prisma.module';
import { RestoreExpiredBansJob } from './jobs/restore-expired-bans.job';

@Module({
  imports: [ScheduleModule.forRoot(), PrismaModule],
  providers: [RestoreExpiredBansJob],
})
export class SchedulerModule {}
