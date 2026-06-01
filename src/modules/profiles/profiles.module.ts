import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { SupabaseModule } from '../../supabase/supabase.module';
import { ProfilesController } from './profiles.controller';
import { FindProfileByUserIdFeature } from './features/find-profile-by-user-id.feature';
import { CreateProfileFeature } from './features/create-profile.feature';
import { UpdateProfileFeature } from './features/update-profile.feature';

@Module({
  imports: [PrismaModule, SupabaseModule],
  controllers: [ProfilesController],
  providers: [
    FindProfileByUserIdFeature,
    CreateProfileFeature,
    UpdateProfileFeature,
  ],
  exports: [FindProfileByUserIdFeature],
})
export class ProfilesModule {}
