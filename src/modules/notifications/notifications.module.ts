import { Module } from '@nestjs/common';
import { ServiceCreatedHandler } from '@modules/notifications/handlers/service-created.handler';
import { ServiceApprovedHandler } from '@modules/notifications/handlers/service-approved.handler';
import { ServiceRejectedHandler } from '@modules/notifications/handlers/service-rejected.handler';
import { BrevoEmailProvider } from '@modules/notifications/providers/brevo-email.provider';

@Module({
  providers: [
    ServiceCreatedHandler,
    ServiceApprovedHandler,
    ServiceRejectedHandler,
    BrevoEmailProvider,
  ],
})
export class NotificationsModule {}
