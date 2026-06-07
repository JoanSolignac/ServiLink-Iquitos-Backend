import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ServiceRequestCreated } from '@modules/service-requests/events/service-request-created.event';
import { NotificationPushService } from '@modules/notifications/services/notification-push.service';

@Injectable()
export class ServiceRequestCreatedHandler {
  constructor(private readonly pushService: NotificationPushService) {}

  @OnEvent(ServiceRequestCreated.name, { async: true })
  async handle(event: ServiceRequestCreated): Promise<void> {
    await this.pushService.send({
      fcmTokens: event.fcmToken,
      title: 'Nueva solicitud de servicio',
      body: `${event.userName} solicitó tu servicio "${event.serviceTitle}".`,
    });
  }
}
