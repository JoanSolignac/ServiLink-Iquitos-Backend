import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ServiceApprovedEvent } from '@modules/services/events/service-approved.event';
import { EmailSendService } from '@modules/notifications/services/email-send.service';
import { buildEmailTemplateServiceApproved } from '@modules/notifications/utils/service-approved.utils';

@Injectable()
export class ServiceApprovedHandler {
  constructor(private readonly emailSend: EmailSendService) {}

  @OnEvent(ServiceApprovedEvent.name, { async: true })
  async handle(event: ServiceApprovedEvent): Promise<void> {
    await this.emailSend.send({
      to: [{ name: event.userName, email: event.userEmail }],
      subject: `Tu servicio "${event.serviceTitle}" ha sido aprobado.`,
      htmlContent: buildEmailTemplateServiceApproved(
        event.serviceTitle,
        event.userName,
      ),
    });
  }
}
