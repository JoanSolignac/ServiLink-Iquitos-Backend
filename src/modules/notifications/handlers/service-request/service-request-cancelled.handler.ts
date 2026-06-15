import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ServiceRequestCancelled } from '@modules/service-requests/events/service-request-cancelled.event';
import { NotificationPushService } from '@modules/notifications/services/notification-push.service';
import { EmailSendService } from '@modules/notifications/services/email-send.service';
import { buildEmailTemplateServiceRequestCancelled } from '@modules/notifications/utils/service-request-cancelled.utils';

@Injectable()
export class ServiceRequestCancelledHandler {
  constructor(
    private readonly pushService: NotificationPushService,
    private readonly emailSend: EmailSendService,
  ) {}

  @OnEvent(ServiceRequestCancelled.name, { async: true })
  async handle(event: ServiceRequestCancelled): Promise<void> {
    const body = event.cancelledByCustomer
      ? `El cliente canceló la solicitud para el servicio "${event.serviceTitle}".`
      : `El proveedor canceló la solicitud para el servicio "${event.serviceTitle}".`;

    await Promise.all([
      this.pushService.send({
        fcmTokens: event.fcmTokens,
        title: 'Solicitud cancelada',
        body,
      }),
      this.emailSend.send({
        to: [{ name: event.userName, email: event.userEmail }],
        subject: `La solicitud para "${event.serviceTitle}" fue cancelada.`,
        htmlContent: buildEmailTemplateServiceRequestCancelled(
          event.serviceTitle,
          event.userName,
          event.cancelledByCustomer,
        ),
      }),
    ]);
  }
}
