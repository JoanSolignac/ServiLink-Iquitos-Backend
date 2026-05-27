import { Module } from '@nestjs/common';
import { ProfileRepository } from './domain/repositories/profile.repository';
import { PrismaProfileRepository } from './infrastructure/repositories/prisma-profile.repository';
import { ProfileController } from './presentation/controllers/profile.controller';
import { CreateProfileUseCase } from './application/use-cases/create-profile.use-case';
import { UpdateProfileUseCase } from './application/use-cases/update-profile.use-case';
import { FindProfileByUserIdUseCase } from './application/use-cases/find-profile-by-user-id.use-case';

@Module({
  controllers: [ProfileController],
  providers: [
    {
      provide: ProfileRepository,
      useClass: PrismaProfileRepository,
    },
    CreateProfileUseCase,
    UpdateProfileUseCase,
    FindProfileByUserIdUseCase,
  ],
  exports: [FindProfileByUserIdUseCase, ProfileRepository],
})
export class ProfilesModule {}
