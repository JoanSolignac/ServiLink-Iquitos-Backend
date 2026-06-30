import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { passportJwtSecret } from 'jwks-rsa';
import { Auth0PayloadInterface } from './auth0-payload.interface';
import { SyncUserFeature } from '../../features/sync-user.feature';
import { AuthCurrentUser } from '@common/interfaces/auth-current-user.interface';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { FindProfileByUserIdFeature } from '../../../profiles/features/find-profile-by-user-id.feature';
import { ProfileNotFoundException } from '../../../profiles/exceptions/profile-not-found.exception';
import { UserStatus } from '@prisma/client';
import { UserSuspendedException } from '../../../users/exceptions/user-suspended.exception';

@Injectable()
export class Auth0Strategy extends PassportStrategy(Strategy, 'auth0') {
  private readonly logger = new Logger(Auth0Strategy.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly syncUserFeature: SyncUserFeature,
    private readonly findProfileByUserIdFeature: FindProfileByUserIdFeature,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      issuer: configService.getOrThrow<string>('AUTH0_ISSUER'),
      audience: configService.getOrThrow<string>('AUTH0_AUDIENCE'),
      algorithms: ['RS256'],
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksUri: `https://${configService.getOrThrow<string>('AUTH0_DOMAIN')}/.well-known/jwks.json`,
      }),
    });
  }

  async validate(payload: Auth0PayloadInterface): Promise<AuthCurrentUser> {
    this.logger.log(`Auth0 payload received: sub=${payload.sub}`);

    const [provider, providerId] = payload.sub.split('|');

    if (!provider || !providerId) {
      this.logger.warn('Invalid auth0 payload: missing provider or providerId');
      throw new UnauthorizedException();
    }

    const user = await this.syncUserFeature.execute(
      providerId,
      payload['https://servilink.com/email'],
      provider,
    );

    if (!user.email) {
      this.logger.warn(`User without email found: id=${user.id}`);
      throw new UnauthorizedException();
    }

    if (user.status === UserStatus.SUSPENDED) {
      throw new UserSuspendedException();
    }

    let hasProfile = false;
    try {
      await this.findProfileByUserIdFeature.execute(user.id);
      hasProfile = true;
    } catch (error) {
      if (error instanceof ProfileNotFoundException) {
        hasProfile = false;
      } else {
        throw error;
      }
    }

    // Google ya verifica el correo de su lado, por lo que se considera verificado.
    const isGoogleProvider = provider.toLowerCase().startsWith('google');
    const emailVerified =
      (payload['https://servilink.com/email_verified'] ?? false) ||
      isGoogleProvider;

    return {
      id: user.id,
      role: user.role,
      status: user.status,
      email: user.email,
      hasProfile,
      emailVerified,
      isPremium: user.isPremium,
      bannedUntil: user.bannedUntil,
      authProviderId: payload.sub,
    };
  }
}
