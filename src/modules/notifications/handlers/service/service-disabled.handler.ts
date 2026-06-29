import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ServiceDisabledEvent } from '@modules/services/events/service-disabled.event';
import { EmailSendService } from '@modules/notifications/services/email-send.service';
import { buildEmailTemplateServiceDisabled } from '@modules/notifications/utils/service-disabled.utils';

@Injectable()
export class ServiceDisabledHandler {
  constructor(private readonly emailSend: EmailSendService) {}

  @OnEvent(ServiceDisabledEvent.name, { async: true })
  async handle(event: ServiceDisabledEvent): Promise<void> {
    await this.emailSend.send({
      to: [{ name: event.userName, email: event.userEmail }],
      subject: `Tu servicio "${event.serviceTitle}" ha sido desactivado`,
      htmlContent: buildEmailTemplateServiceDisabled(
        event.userName,
        event.serviceTitle,
        event.disabledUntil,
      ),
    });
  }
}
