import { Module } from '@nestjs/common';
import { ServiceCreatedHandler } from '@modules/notifications/handlers/service/service-created.handler';
import { ServiceApprovedHandler } from '@modules/notifications/handlers/service/service-approved.handler';
import { ServiceRejectedHandler } from '@modules/notifications/handlers/service/service-rejected.handler';
import { RatingCreatedHandler } from '@modules/notifications/handlers/rating/rating-created.handler';
import { ReportCreatedHandler } from '@modules/notifications/handlers/report/report-created.handler';
import { ReportReviewedHandler } from '@modules/notifications/handlers/report/report-reviewed.handler';
import { UserReportThresholdReachedHandler } from '@modules/notifications/handlers/report/user-report-threshold-reached.handler';
import { BrevoEmailProvider } from '@modules/notifications/providers/brevo-email.provider';
import { FirebasePushProvider } from '@modules/notifications/providers/firebase-push.provider';
import { EmailSendService } from '@modules/notifications/services/email-send.service';
import { NotificationPushService } from '@modules/notifications/services/notification-push.service';

@Module({
  providers: [
    // Email
    BrevoEmailProvider,
    EmailSendService,
    ServiceCreatedHandler,
    ServiceApprovedHandler,
    ServiceRejectedHandler,
    // Push + Email — valoraciones
    FirebasePushProvider,
    NotificationPushService,
    RatingCreatedHandler,
    // Reportes
    ReportCreatedHandler,
    ReportReviewedHandler,
    UserReportThresholdReachedHandler,
  ],
})
export class NotificationsModule {}
