import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from './shared/infrastructure/config/app.config';
import { validationSchema } from './shared/infrastructure/config/schemas/validation.schema';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      validationSchema,
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    SharedModule,
  ],
})
export class AppModule {}
