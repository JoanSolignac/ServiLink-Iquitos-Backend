import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { RatingCreated } from '@modules/ratings/events/rating-created.event';
import { NotificationPushService } from '@modules/notifications/services/notification-push.service';
import { EmailSendService } from '@modules/notifications/services/email-send.service';
import { buildEmailTemplateRatingCreated } from '@modules/notifications/utils/rating-created.utils';

@Injectable()
export class RatingCreatedHandler {
  constructor(
    private readonly pushService: NotificationPushService,
    private readonly emailSend: EmailSendService,
  ) {}

  @OnEvent(RatingCreated.name, { async: true })
  async handle(event: RatingCreated): Promise<void> {
    await Promise.all([
      this.pushService.send({
        fcmTokens: event.fcmTokens,
        title: 'Nueva valoración recibida',
        body: `Tu servicio "${event.serviceTitle}" recibió una valoración de ${event.score} estrellas.`,
      }),
      this.emailSend.send({
        to: [{ name: event.providerName, email: event.providerEmail }],
        subject: `Tu servicio "${event.serviceTitle}" recibió una nueva valoración.`,
        htmlContent: buildEmailTemplateRatingCreated(
          event.serviceTitle,
          event.providerName,
          event.score,
        ),
      }),
    ]);
  }
}
