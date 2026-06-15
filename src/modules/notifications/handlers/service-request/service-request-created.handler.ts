import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ServiceRequestCreated } from '@modules/service-requests/events/service-request-created.event';
import { NotificationPushService } from '@modules/notifications/services/notification-push.service';
import { EmailSendService } from '@modules/notifications/services/email-send.service';
import { buildEmailTemplateServiceRequestCreated } from '@modules/notifications/utils/service-request-created.utils';

@Injectable()
export class ServiceRequestCreatedHandler {
  constructor(
    private readonly pushService: NotificationPushService,
    private readonly emailSend: EmailSendService,
  ) {}

  @OnEvent(ServiceRequestCreated.name, { async: true })
  async handle(event: ServiceRequestCreated): Promise<void> {
    await Promise.all([
      this.pushService.send({
        fcmTokens: event.fcmToken,
        title: 'Nueva solicitud de servicio',
        body: `${event.customerName} solicitó tu servicio "${event.serviceTitle}".`,
      }),
      this.emailSend.send({
        to: [{ name: event.providerName, email: event.providerEmail }],
        subject: `Nueva solicitud para tu servicio "${event.serviceTitle}".`,
        htmlContent: buildEmailTemplateServiceRequestCreated(
          event.serviceTitle,
          event.providerName,
          event.customerName,
        ),
      }),
    ]);
  }
}
