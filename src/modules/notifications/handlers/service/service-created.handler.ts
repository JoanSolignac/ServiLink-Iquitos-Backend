import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ServiceCreatedEvent } from '@modules/services/events/service-created.event';
import { EmailSendService } from '@modules/notifications/services/email-send.service';
import { buildEmailTemplateServicePendingReview } from '@modules/notifications/utils/service-pending-review.utils';

@Injectable()
export class ServiceCreatedHandler {
  constructor(private readonly emailSend: EmailSendService) {}

  @OnEvent(ServiceCreatedEvent.name, { async: true })
  async handle(event: ServiceCreatedEvent): Promise<void> {
    await this.emailSend.send({
      to: [{ name: event.userName, email: event.userEmail }],
      subject: `Tu servicio ${event.serviceTitle} se ha creado correctamente.`,
      htmlContent: buildEmailTemplateServicePendingReview(
        event.serviceTitle,
        event.userName,
      ),
    });
  }
}
