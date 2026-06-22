import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { Auth0ManagementException } from '../exceptions/auth0-management.exception';

interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

@Injectable()
export class Auth0ManagementProvider {
  private readonly logger = new Logger(Auth0ManagementProvider.name);
  private readonly client: AxiosInstance;
  private readonly domain: string;
  private readonly audience: string;
  private readonly clientId: string;
  private readonly clientSecret: string;

  // Caché en memoria del token de la Management API
  private cachedToken: string | null = null;
  private tokenExpiresAt = 0;

  // Margen de seguridad para renovar el token antes de su expiración real
  private static readonly EXPIRY_MARGIN_MS = 60_000;

  constructor(config: ConfigService) {
    this.domain = config.getOrThrow<string>('AUTH0_DOMAIN');
    this.clientId = config.getOrThrow<string>('AUTH0_MGMT_CLIENT_ID');
    this.clientSecret = config.getOrThrow<string>('AUTH0_MGMT_CLIENT_SECRET');
    this.audience = `https://${this.domain}/api/v2/`;

    this.client = axios.create({
      baseURL: `https://${this.domain}`,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async sendVerificationEmail(userId: string): Promise<void> {
    const token = await this.getManagementToken();

    try {
      const { data } = await this.client.post<{ id: string }>(
        '/api/v2/jobs/verification-email',
        { user_id: userId },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      this.logger.log(
        `Verification-email job created for user_id=${userId} (jobId=${data.id})`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send verification email for user_id=${userId}: ${this.describeError(error)}`,
      );
      throw new Auth0ManagementException(
        'Failed to send the verification email via Auth0.',
      );
    }
  }

  private async getManagementToken(): Promise<string> {
    if (this.cachedToken && Date.now() < this.tokenExpiresAt) {
      return this.cachedToken;
    }

    try {
      const { data } = await this.client.post<TokenResponse>('/oauth/token', {
        grant_type: 'client_credentials',
        client_id: this.clientId,
        client_secret: this.clientSecret,
        audience: this.audience,
      });

      this.cachedToken = data.access_token;
      this.tokenExpiresAt =
        Date.now() +
        data.expires_in * 1000 -
        Auth0ManagementProvider.EXPIRY_MARGIN_MS;

      return this.cachedToken;
    } catch (error) {
      this.logger.error(
        `Failed to obtain Auth0 Management API token: ${this.describeError(error)}`,
      );
      throw new Auth0ManagementException(
        'Failed to obtain an Auth0 Management API token.',
      );
    }
  }

  private describeError(error: unknown): string {
    if (axios.isAxiosError(error)) {
      return `status=${error.response?.status} data=${JSON.stringify(error.response?.data)}`;
    }
    return String(error);
  }
}
