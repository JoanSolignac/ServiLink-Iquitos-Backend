import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from '@common/config/validation.schema';
import { PrismaModule } from '@prisma/prisma.module';
import { UsersModule } from '@modules/users/users.module';
import { AuthModule } from '@modules/auth/auth.module';
import { ProfilesModule } from '@modules/profiles/profiles.module';
import { SupabaseModule } from '@supabase/supabase.module';
import { ServicesModule } from '@modules/services/services.module';
import { SeederModule } from './seeder/seeder.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    ProfilesModule,
    SupabaseModule,
    ServicesModule,
    SeederModule,
  ],
})
export class AppModule {}
