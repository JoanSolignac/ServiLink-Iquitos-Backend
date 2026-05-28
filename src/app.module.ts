import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './shared/config/schemas/validation.schema';
import { UuidModule } from './uuid/uuid.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { SupabaseModule } from './supabase/supabase.module';
import { HashModule } from './hash/hash.module';
import { ServicesModule } from './modules/services/services.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    UuidModule,
    PrismaModule,
    UsersModule,
    AuthModule,
    ProfilesModule,
    SupabaseModule,
    HashModule,
    ServicesModule,
  ],
})
export class AppModule {}
