import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ServiceRequestCancelled } from '@modules/service-requests/events/service-request-cancelled.event';
import { NotificationPushService } from '@modules/notifications/services/notification-push.service';

@Injectable()
export class ServiceRequestCancelledHandler {
  constructor(private readonly pushService: NotificationPushService) {}

  @OnEvent(ServiceRequestCancelled.name, { async: true })
  async handle(event: ServiceRequestCancelled): Promise<void> {
    const title = 'Solicitud cancelada';

    const body = event.cancelledByCustomer
      ? `El cliente canceló la solicitud para el servicio "${event.serviceTitle}".`
      : `El proveedor canceló la solicitud para el servicio "${event.serviceTitle}".`;

    await this.pushService.send({
      fcmTokens: event.fcmTokens,
      title,
      body,
    });
  }
}
