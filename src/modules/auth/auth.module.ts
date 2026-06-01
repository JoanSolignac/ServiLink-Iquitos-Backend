import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { ProfilesModule } from '../profiles/profiles.module';
import { AuthController } from './auth.controller';
import { SyncUserFeature } from './features/sync-user.feature';
import { Auth0Strategy } from './strategies/auth0/auth0.strategy';

@Module({
  imports: [PrismaModule, UsersModule, ProfilesModule],
  providers: [SyncUserFeature, Auth0Strategy],
  controllers: [AuthController],
})
export class AuthModule {}
