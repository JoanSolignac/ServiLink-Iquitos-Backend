import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebasePushProvider implements OnModuleInit {
  constructor(private readonly config: ConfigService) {}

  onModuleInit(): void {
    this.initializeFirebase();
  }

  private initializeFirebase(): void {
    if (admin.apps.length) return;

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: this.config.getOrThrow('FIREBASE_PROJECT_ID'),
        clientEmail: this.config.getOrThrow('FIREBASE_CLIENT_EMAIL'),
        privateKey: this.config
          .getOrThrow<string>('FIREBASE_PRIVATE_KEY')
          .replace(/\\n/g, '\n'),
      }),
    });
  }

  async sendToTokens(
    tokens: string[],
    title: string,
    body: string,
    data?: Record<string, string>,
  ): Promise<void> {
    if (!tokens.length) return;

    await admin.messaging().sendEachForMulticast({
      tokens,
      notification: { title, body },
      ...(data && { data }),
    });
  }
}
