import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ServiceRequestConfirmed } from '@modules/service-requests/events/service-request-confirmed.event';
import { NotificationPushService } from '@modules/notifications/services/notification-push.service';

@Injectable()
export class ServiceRequestConfirmedHandler {
  constructor(private readonly pushService: NotificationPushService) {}

  @OnEvent(ServiceRequestConfirmed.name, { async: true })
  async handle(event: ServiceRequestConfirmed): Promise<void> {
    await this.pushService.send({
      fcmTokens: event.fcmTokens,
      title: 'Servicio confirmado',
      body: `El cliente confirmó la finalización del servicio "${event.serviceTitle}".`,
    });
  }
}
