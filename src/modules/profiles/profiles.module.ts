import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { SupabaseModule } from '../../supabase/supabase.module';
import { ProfilesController } from './profiles.controller';
import { FindProfileByUserIdFeature } from './features/find-profile-by-user-id.feature';
import { CreateProfileFeature } from './features/create-profile.feature';
import { UpdateProfileFeature } from './features/update-profile.feature';
import { GetProviderPublicProfileFeature } from './features/get-provider-public-profile.feature';
import { CheckPhoneExistsFeature } from './features/check-phone-exists.feature';

@Module({
  imports: [PrismaModule, SupabaseModule],
  controllers: [ProfilesController],
  providers: [
    FindProfileByUserIdFeature,
    CreateProfileFeature,
    UpdateProfileFeature,
    GetProviderPublicProfileFeature,
    CheckPhoneExistsFeature,
  ],
  exports: [FindProfileByUserIdFeature],
})
export class ProfilesModule {}
