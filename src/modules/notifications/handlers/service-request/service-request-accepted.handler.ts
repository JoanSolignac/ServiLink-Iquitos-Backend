import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ServiceRequestAccepted } from '@modules/service-requests/events/service-request-accepted.event';
import { NotificationPushService } from '@modules/notifications/services/notification-push.service';

@Injectable()
export class ServiceRequestAcceptedHandler {
  constructor(private readonly pushService: NotificationPushService) {}

  @OnEvent(ServiceRequestAccepted.name, { async: true })
  async handle(event: ServiceRequestAccepted): Promise<void> {
    await this.pushService.send({
      fcmTokens: event.fcmTokens,
      title: 'Tu solicitud fue aceptada',
      body: `El proveedor aceptó tu solicitud para el servicio "${event.serviceTitle}".`,
    });
  }
}
