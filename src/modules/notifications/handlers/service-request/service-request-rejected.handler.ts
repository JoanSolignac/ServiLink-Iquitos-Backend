import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ServiceRequestRejected } from '@modules/service-requests/events/service-request-rejected.event';
import { NotificationPushService } from '@modules/notifications/services/notification-push.service';
import { EmailSendService } from '@modules/notifications/services/email-send.service';
import { buildEmailTemplateServiceRequestRejected } from '@modules/notifications/utils/service-request-rejected.utils';

@Injectable()
export class ServiceRequestRejectedHandler {
  constructor(
    private readonly pushService: NotificationPushService,
    private readonly emailSend: EmailSendService,
  ) {}

  @OnEvent(ServiceRequestRejected.name, { async: true })
  async handle(event: ServiceRequestRejected): Promise<void> {
    const title = event.rejectedByProvider
      ? 'Tu solicitud fue rechazada'
      : 'El cliente no confirmó el servicio';

    const body = event.rejectedByProvider
      ? `El proveedor rechazó tu solicitud para el servicio "${event.serviceTitle}".`
      : `El cliente no confirmó la finalización del servicio "${event.serviceTitle}".`;

    const subject = event.rejectedByProvider
      ? `Tu solicitud para "${event.serviceTitle}" fue rechazada.`
      : `El cliente no confirmó el servicio "${event.serviceTitle}".`;

    await Promise.all([
      this.pushService.send({ fcmTokens: event.fcmTokens, title, body }),
      this.emailSend.send({
        to: [{ name: event.userName, email: event.userEmail }],
        subject,
        htmlContent: buildEmailTemplateServiceRequestRejected(
          event.serviceTitle,
          event.userName,
          event.rejectedByProvider,
        ),
      }),
    ]);
  }
}
