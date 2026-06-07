import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { DomainExceptionFilter } from './common/filters/domain-exception.filter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.setGlobalPrefix(configService.getOrThrow<string>('GLOBAL_PREFIX'));

  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalFilters(
    new PrismaExceptionFilter(),
    new DomainExceptionFilter(),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Servilink Iquitos API')
    .setDescription(
      'API REST del backend de Servilink Iquitos. Gestiona autenticación federada con Auth0, ' +
        'perfiles de usuario, marketplace de servicios, solicitudes de servicio y notificaciones ' +
        'push/email. Todos los endpoints requieren un Bearer Token JWT de Auth0 salvo indicación contraria.',
    )
    .setVersion('1.0')
    .addTag('Auth', 'Autenticación y perfil del usuario autenticado')
    .addTag('Profiles', 'Gestión de perfiles de usuario y foto de perfil')
    .addTag(
      'Services',
      'Marketplace de servicios: publicación, aprobación y búsqueda',
    )
    .addTag(
      'Service Requests',
      'Solicitudes de servicio: ciclo de vida completo entre clientes y proveedores',
    )
    .addTag(
      'Devices',
      'Registro de dispositivos para notificaciones push (FCM)',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Auth0 JWT token',
      },
      'bearer',
    )
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const PORT = configService.getOrThrow<number>('PORT');

  await app.listen(PORT, '0.0.0.0');

  console.log(`Port started on: ${PORT}`);
}
void bootstrap();
