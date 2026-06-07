import { EmailRecipient } from '@modules/notifications/types/email-recipient.type';
import { EmailSender } from '@modules/notifications/types/email-sender.type';

export type SendEmailParams = {
  to: EmailRecipient[];
  subject: string;
  htmlContent: string;
  sender: EmailSender;
};
