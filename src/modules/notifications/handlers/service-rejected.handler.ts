import { Injectable } from '@nestjs/common';
import { ServiceRejectedEvent } from '@modules/services/events/service-rejected.event';
import { OnEvent } from '@nestjs/event-emitter';
import { BrevoEmailProvider } from '@modules/notifications/providers/brevo-email.provider';
import { ConfigService } from '@nestjs/config';
import { buildEmailTemplateServiceRejected } from '@modules/notifications/utils/service-rejected.utils';

@Injectable()
export class ServiceRejectedHandler {
  constructor(
    private readonly configService: ConfigService,
    private readonly brevoEmailProvider: BrevoEmailProvider,
  ) {}

  @OnEvent(ServiceRejectedEvent.name, { async: true })
  async handle(event: ServiceRejectedEvent): Promise<void> {
    const senderName =
      this.configService.getOrThrow<string>('BREVO_SENDER_NAME');
    const senderEmail =
      this.configService.getOrThrow<string>('BREVO_SENDER_EMAIL');
    const htmlContent = buildEmailTemplateServiceRejected(
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
      subject: `Tu servicio "${event.serviceTitle}" no ha sido aprobado.`,
      htmlContent,
      sender: {
        name: senderName,
        email: senderEmail,
      },
    });
  }
}
