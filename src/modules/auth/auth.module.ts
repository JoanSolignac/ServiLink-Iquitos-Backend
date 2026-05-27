import { Module } from '@nestjs/common';
import { HashModule } from '../../hash/hash.module';
import { AuthIdentityRepository } from './domain/repositories/auth-identity.repository';
import { PrismaAuthIdentityRepository } from './infrastructure/repositories/prisma-auth-identity.repository';
import { AuthIdentityFinderService } from './application/services/auth-identity-finder.service';
import { UsersModule } from '../users/users.module';
import { ProfilesModule } from '../profiles/profiles.module';
import { AuthController } from './presentation/controllers/auth.controller';
import { SyncUserUseCase } from './application/use-cases/sync-user-use-case';
import { Auth0Strategy } from './infrastructure/security/strategies/auth0.strategy';
import { RoleGuard } from './infrastructure/security/guards/role.guard';

@Module({
  imports: [HashModule, UsersModule, ProfilesModule],
  providers: [
    {
      provide: AuthIdentityRepository,
      useClass: PrismaAuthIdentityRepository,
    },
    AuthIdentityFinderService,
    SyncUserUseCase,
    Auth0Strategy,
    RoleGuard,
  ],
  controllers: [AuthController],
  exports: [AuthIdentityFinderService],
})
export class AuthModule {}
