import { Module } from '@nestjs/common';
import { ServiceCreatedHandler } from '@modules/notifications/handlers/service/service-created.handler';
import { ServiceApprovedHandler } from '@modules/notifications/handlers/service/service-approved.handler';
import { ServiceRejectedHandler } from '@modules/notifications/handlers/service/service-rejected.handler';
import { ServiceRequestCreatedHandler } from '@modules/notifications/handlers/service-request/service-request-created.handler';
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
    // Push
    FirebasePushProvider,
    NotificationPushService,
    ServiceRequestCreatedHandler,
  ],
})
export class NotificationsModule {}
