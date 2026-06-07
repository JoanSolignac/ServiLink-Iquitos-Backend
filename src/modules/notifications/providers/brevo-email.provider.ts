import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { ConfigService } from '@nestjs/config';
import { SendEmailParams } from '@modules/notifications/types/send-email-params.type';

@Injectable()
export class BrevoEmailProvider {
  private client: AxiosInstance;

  constructor(private readonly configSevice: ConfigService) {
    this.client = axios.create({
      baseURL: 'https://api.brevo.com/v3',
      headers: {
        'api-key': configSevice.getOrThrow<string>('BREVO_API_KEY'),
        'Content-Type': 'application/json',
      },
    });
  }

  async sendEmail(payload: SendEmailParams): Promise<void> {
    try {
      await this.client.post('/smtp/email', payload);
    } catch (error) {
      throw new Error(`Failed to send email via Brevo: ${error}`);
    }
  }
}
