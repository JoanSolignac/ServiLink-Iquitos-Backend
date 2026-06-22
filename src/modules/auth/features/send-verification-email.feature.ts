import { Injectable, Logger } from '@nestjs/common';
import { AuthCurrentUser } from '@common/interfaces/auth-current-user.interface';
import { Auth0ManagementProvider } from '../providers/auth0-management.provider';
import { EmailAlreadyVerifiedException } from '../exceptions/email-already-verified.exception';

@Injectable()
export class SendVerificationEmailFeature {
  private readonly logger = new Logger(SendVerificationEmailFeature.name);

  constructor(private readonly auth0Management: Auth0ManagementProvider) {}

  async execute(authUser: AuthCurrentUser): Promise<void> {
    if (authUser.emailVerified) {
      throw new EmailAlreadyVerifiedException();
    }

    await this.auth0Management.sendVerificationEmail(authUser.authProviderId);

    this.logger.log(`Verification email requested for user: id=${authUser.id}`);
  }
}
