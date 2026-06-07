import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ServiceRequestRejected } from '@modules/service-requests/events/service-request-rejected.event';
import { NotificationPushService } from '@modules/notifications/services/notification-push.service';

@Injectable()
export class ServiceRequestRejectedHandler {
  constructor(private readonly pushService: NotificationPushService) {}

  @OnEvent(ServiceRequestRejected.name, { async: true })
  async handle(event: ServiceRequestRejected): Promise<void> {
    const title = event.rejectedByProvider
      ? 'Tu solicitud fue rechazada'
      : 'El cliente no confirmó el servicio';

    const body = event.rejectedByProvider
      ? `El proveedor rechazó tu solicitud para el servicio "${event.serviceTitle}".`
      : `El cliente no confirmó la finalización del servicio "${event.serviceTitle}".`;

    await this.pushService.send({
      fcmTokens: event.fcmTokens,
      title,
      body,
    });
  }
}
