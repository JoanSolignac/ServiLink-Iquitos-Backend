import { Injectable } from '@nestjs/common';
import { FirebasePushProvider } from '@modules/notifications/providers/firebase-push.provider';
import { SendPushInput } from '@modules/notifications/types/send-push-input.type';

@Injectable()
export class NotificationPushService {
  constructor(private readonly firebase: FirebasePushProvider) {}

  async send(input: SendPushInput): Promise<void> {
    await this.firebase.sendToTokens(input.fcmTokens, input.title, input.body);
  }
}
