import { Injectable } from '@nestjs/common';
import { ServiceCreatedEvent } from '@modules/services/events/service-created.event';
import { OnEvent } from '@nestjs/event-emitter';
import { BrevoEmailProvider } from '@modules/notifications/providers/brevo-email.provider';
import { ConfigService } from '@nestjs/config';
import { buildEmailTemplateServicePendingReview } from '@modules/notifications/utils/service-pending-review.utils';

@Injectable()
export class ServiceCreatedHandler {
  constructor(
    private readonly configService: ConfigService,
    private readonly brevoEmailProvide: BrevoEmailProvider,
  ) {}

  @OnEvent(ServiceCreatedEvent.name, { async: true })
  async handle(event: ServiceCreatedEvent): Promise<void> {
    const senderName =
      this.configService.getOrThrow<string>('BREVO_SENDER_NAME');
    const senderEmail =
      this.configService.getOrThrow<string>('BREVO_SENDER_EMAIL');
    const htmlContent = buildEmailTemplateServicePendingReview(
      event.serviceTitle,
      event.userName,
    );

    await this.brevoEmailProvide.sendEmail({
      to: [
        {
          name: event.userName,
          email: event.userEmail,
        },
      ],
      subject: `Tu servicio ${event.serviceTitle} se ha creado correctamente.`,
      htmlContent,
      sender: {
        name: senderName,
        email: senderEmail,
      },
    });
  }
}
