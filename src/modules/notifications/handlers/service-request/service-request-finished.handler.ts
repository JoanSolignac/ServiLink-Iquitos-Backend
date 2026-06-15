import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ServiceRequestFinished } from '@modules/service-requests/events/service-request-finished.event';
import { NotificationPushService } from '@modules/notifications/services/notification-push.service';
import { EmailSendService } from '@modules/notifications/services/email-send.service';
import { buildEmailTemplateServiceRequestFinished } from '@modules/notifications/utils/service-request-finished.utils';

@Injectable()
export class ServiceRequestFinishedHandler {
  constructor(
    private readonly pushService: NotificationPushService,
    private readonly emailSend: EmailSendService,
  ) {}

  @OnEvent(ServiceRequestFinished.name, { async: true })
  async handle(event: ServiceRequestFinished): Promise<void> {
    await Promise.all([
      this.pushService.send({
        fcmTokens: event.fcmTokens,
        title: 'Servicio finalizado',
        body: `El proveedor marcó el servicio "${event.serviceTitle}" como finalizado. Confírmalo para completar.`,
      }),
      this.emailSend.send({
        to: [{ name: event.userName, email: event.userEmail }],
        subject: `El servicio "${event.serviceTitle}" fue finalizado. Por favor confírmalo.`,
        htmlContent: buildEmailTemplateServiceRequestFinished(
          event.serviceTitle,
          event.userName,
        ),
      }),
    ]);
  }
}
