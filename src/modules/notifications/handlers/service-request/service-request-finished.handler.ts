import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ServiceRequestFinished } from '@modules/service-requests/events/service-request-finished.event';
import { NotificationPushService } from '@modules/notifications/services/notification-push.service';

@Injectable()
export class ServiceRequestFinishedHandler {
  constructor(private readonly pushService: NotificationPushService) {}

  @OnEvent(ServiceRequestFinished.name, { async: true })
  async handle(event: ServiceRequestFinished): Promise<void> {
    await this.pushService.send({
      fcmTokens: event.fcmTokens,
      title: 'Servicio finalizado',
      body: `El proveedor marcó el servicio "${event.serviceTitle}" como finalizado. Confírmalo para completar.`,
    });
  }
}
