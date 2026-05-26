import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { passportJwtSecret } from 'jwks-rsa';
import { Auth0PayloadInterface } from '../../../domain/interfaces/auth0-payload.interface';
import { SyncUserUseCase } from '../../../application/use-cases/sync-user-use-case';
import { AuthProvider } from '../../../domain/value-objects/auth-provider.value-object';
import { UserEmail } from '../../../../users/domain/value-objects/user-email.value-object';
import { ProviderId } from '../../../domain/value-objects/provider-id.value-object';
import { AuthCurrentUser } from '../../../domain/interfaces/auth-current-user.interface';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class Auth0Strategy extends PassportStrategy(Strategy, 'auth0') {
  private readonly logger = new Logger(Auth0Strategy.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly syncUserUseCase: SyncUserUseCase,
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

    const user = await this.syncUserUseCase.execute(
      ProviderId.from(providerId),
      UserEmail.from(payload['https://servilink.com/email']),
      AuthProvider.from(provider),
    );

    if (!user.getEmail()) {
      this.logger.warn(`User without email found: id=${user.getId()}`);
      throw new UnauthorizedException();
    }

    this.logger.log(
      `User validated: id=${user.getId()}, email=${user.getEmail()}, role=${user.getRole()}`
    );

    return {
      id: user.getId(),
      role: user.getRole(),
      email: user.getEmail(),
    };
  }
}
