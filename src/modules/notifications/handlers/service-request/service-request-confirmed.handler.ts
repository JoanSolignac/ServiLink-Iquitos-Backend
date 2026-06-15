import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ServiceRequestConfirmed } from '@modules/service-requests/events/service-request-confirmed.event';
import { NotificationPushService } from '@modules/notifications/services/notification-push.service';
import { EmailSendService } from '@modules/notifications/services/email-send.service';
import { buildEmailTemplateServiceRequestConfirmed } from '@modules/notifications/utils/service-request-confirmed.utils';

@Injectable()
export class ServiceRequestConfirmedHandler {
  constructor(
    private readonly pushService: NotificationPushService,
    private readonly emailSend: EmailSendService,
  ) {}

  @OnEvent(ServiceRequestConfirmed.name, { async: true })
  async handle(event: ServiceRequestConfirmed): Promise<void> {
    await Promise.all([
      this.pushService.send({
        fcmTokens: event.fcmTokens,
        title: 'Servicio confirmado',
        body: `El cliente confirmó la finalización del servicio "${event.serviceTitle}".`,
      }),
      this.emailSend.send({
        to: [{ name: event.userName, email: event.userEmail }],
        subject: `El servicio "${event.serviceTitle}" fue confirmado por el cliente.`,
        htmlContent: buildEmailTemplateServiceRequestConfirmed(
          event.serviceTitle,
          event.userName,
        ),
      }),
    ]);
  }
}
