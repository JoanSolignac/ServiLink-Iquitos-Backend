import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { ProfilesModule } from '../profiles/profiles.module';
import { AuthController } from './auth.controller';
import { SyncUserFeature } from './features/sync-user.feature';
import { SendVerificationEmailFeature } from './features/send-verification-email.feature';
import { Auth0Strategy } from './strategies/auth0/auth0.strategy';
import { Auth0ManagementProvider } from './providers/auth0-management.provider';

@Module({
  imports: [PrismaModule, UsersModule, ProfilesModule],
  providers: [
    SyncUserFeature,
    SendVerificationEmailFeature,
    Auth0Strategy,
    Auth0ManagementProvider,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
