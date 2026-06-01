import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SupabaseStorageService } from './services/supabase-storage.service';

@Global()
@Module({
  providers: [
    {
      provide: SupabaseClient,
      useFactory: (configService: ConfigService): SupabaseClient => {
        const url = configService.getOrThrow<string>('SUPABASE_URL');
        const key = configService.getOrThrow<string>(
          'SUPABASE_SERVICE_ROLE_KEY',
        );
        return createClient(url, key) as SupabaseClient;
      },
      inject: [ConfigService],
    },
    SupabaseStorageService,
  ],
  exports: [SupabaseStorageService, SupabaseClient],
})
export class SupabaseModule {}
