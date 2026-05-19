import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './shared/infrastructure/config/schemas/validation.schema';
import { IdModule } from './shared/infrastructure/id/id.module';
import { PrismaModule } from './shared/infrastructure/persistence/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    IdModule,
    PrismaModule,
  ],
})
export class AppModule {}
