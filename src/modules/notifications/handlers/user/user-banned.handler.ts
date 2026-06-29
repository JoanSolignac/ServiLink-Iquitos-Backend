import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserBannedEvent } from '@modules/users/events/user-banned.event';
import { EmailSendService } from '@modules/notifications/services/email-send.service';
import { buildEmailTemplateUserBanned } from '@modules/notifications/utils/user-banned.utils';

@Injectable()
export class UserBannedHandler {
  constructor(private readonly emailSend: EmailSendService) {}

  @OnEvent(UserBannedEvent.name, { async: true })
  async handle(event: UserBannedEvent): Promise<void> {
    await this.emailSend.send({
      to: [{ name: event.userName, email: event.userEmail }],
      subject: 'Tu cuenta en ServiLink ha sido suspendida',
      htmlContent: buildEmailTemplateUserBanned(
        event.userName,
        event.bannedUntil,
      ),
    });
  }
}
