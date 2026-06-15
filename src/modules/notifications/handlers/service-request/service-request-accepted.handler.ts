import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ServiceRequestAccepted } from '@modules/service-requests/events/service-request-accepted.event';
import { NotificationPushService } from '@modules/notifications/services/notification-push.service';
import { EmailSendService } from '@modules/notifications/services/email-send.service';
import { buildEmailTemplateServiceRequestAccepted } from '@modules/notifications/utils/service-request-accepted.utils';

@Injectable()
export class ServiceRequestAcceptedHandler {
  constructor(
    private readonly pushService: NotificationPushService,
    private readonly emailSend: EmailSendService,
  ) {}

  @OnEvent(ServiceRequestAccepted.name, { async: true })
  async handle(event: ServiceRequestAccepted): Promise<void> {
    await Promise.all([
      this.pushService.send({
        fcmTokens: event.fcmTokens,
        title: 'Tu solicitud fue aceptada',
        body: `El proveedor aceptó tu solicitud para el servicio "${event.serviceTitle}".`,
      }),
      this.emailSend.send({
        to: [{ name: event.userName, email: event.userEmail }],
        subject: `Tu solicitud para "${event.serviceTitle}" fue aceptada.`,
        htmlContent: buildEmailTemplateServiceRequestAccepted(
          event.serviceTitle,
          event.userName,
        ),
      }),
    ]);
  }
}
