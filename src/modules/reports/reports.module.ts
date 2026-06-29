import { Module } from '@nestjs/common';
import { PrismaModule } from '@prisma/prisma.module';
import { ReportsController } from './reports.controller';
import { CheckMyServiceReportFeature } from './features/check-my-service-report.feature';
import { CheckMyUserReportFeature } from './features/check-my-user-report.feature';
import { CreateServiceReportFeature } from './features/create-service-report.feature';
import { CreateUserReportFeature } from './features/create-user-report.feature';
import { ListReportedUsersFeature } from './features/list-reported-users.feature';
import { GetUserReportsSummaryFeature } from './features/get-user-reports-summary.feature';
import { ListServiceReportsFeature } from './features/list-service-reports.feature';
import { MarkReportReviewedFeature } from './features/mark-report-reviewed.feature';

@Module({
  imports: [PrismaModule],
  controllers: [ReportsController],
  providers: [
    CheckMyServiceReportFeature,
    CheckMyUserReportFeature,
    CreateServiceReportFeature,
    CreateUserReportFeature,
    ListReportedUsersFeature,
    GetUserReportsSummaryFeature,
    ListServiceReportsFeature,
    MarkReportReviewedFeature,
  ],
})
export class ReportsModule {}
