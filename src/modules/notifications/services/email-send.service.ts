import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BrevoEmailProvider } from '@modules/notifications/providers/brevo-email.provider';
import { SendEmailParams } from '@modules/notifications/types/send-email-params.type';

@Injectable()
export class EmailSendService {
  private readonly senderName: string;
  private readonly senderEmail: string;

  constructor(
    private readonly brevo: BrevoEmailProvider,
    config: ConfigService,
  ) {
    this.senderName = config.getOrThrow('BREVO_SENDER_NAME');
    this.senderEmail = config.getOrThrow('BREVO_SENDER_EMAIL');
  }

  async send(input: Omit<SendEmailParams, 'sender'>): Promise<void> {
    await this.brevo.sendEmail({
      ...input,
      sender: { name: this.senderName, email: this.senderEmail },
    });
  }
}
