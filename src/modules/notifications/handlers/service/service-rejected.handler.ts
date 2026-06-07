import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ServiceRejectedEvent } from '@modules/services/events/service-rejected.event';
import { EmailSendService } from '@modules/notifications/services/email-send.service';
import { buildEmailTemplateServiceRejected } from '@modules/notifications/utils/service-rejected.utils';

@Injectable()
export class ServiceRejectedHandler {
  constructor(private readonly emailSend: EmailSendService) {}

  @OnEvent(ServiceRejectedEvent.name, { async: true })
  async handle(event: ServiceRejectedEvent): Promise<void> {
    await this.emailSend.send({
      to: [{ name: event.userName, email: event.userEmail }],
      subject: `Tu servicio "${event.serviceTitle}" no ha sido aprobado.`,
      htmlContent: buildEmailTemplateServiceRejected(
        event.serviceTitle,
        event.userName,
      ),
    });
  }
}
