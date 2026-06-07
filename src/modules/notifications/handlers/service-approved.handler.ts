import { Injectable } from '@nestjs/common';
import { ServiceApprovedEvent } from '@modules/services/events/service-approved.event';
import { OnEvent } from '@nestjs/event-emitter';
import { BrevoEmailProvider } from '@modules/notifications/providers/brevo-email.provider';
import { ConfigService } from '@nestjs/config';
import { buildEmailTemplateServiceApproved } from '@modules/notifications/utils/service-approved.utils';

@Injectable()
export class ServiceApprovedHandler {
  constructor(
    private readonly configService: ConfigService,
    private readonly brevoEmailProvider: BrevoEmailProvider,
  ) {}

  @OnEvent(ServiceApprovedEvent.name, { async: true })
  async handle(event: ServiceApprovedEvent): Promise<void> {
    const senderName =
      this.configService.getOrThrow<string>('BREVO_SENDER_NAME');
    const senderEmail =
      this.configService.getOrThrow<string>('BREVO_SENDER_EMAIL');
    const htmlContent = buildEmailTemplateServiceApproved(
      event.serviceTitle,
      event.userName,
    );

    await this.brevoEmailProvider.sendEmail({
      to: [
        {
          name: event.userName,
          email: event.userEmail,
        },
      ],
      subject: `Tu servicio "${event.serviceTitle}" ha sido aprobado.`,
      htmlContent,
      sender: {
        name: senderName,
        email: senderEmail,
      },
    });
  }
}
