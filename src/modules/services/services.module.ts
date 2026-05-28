import { Module } from '@nestjs/common';
import { ServiceRepository } from './domain/repositories/service.repository';
import { PrismaServiceRepository } from './infrastructure/repositories/prisma-service.repository';
import { ServiceFinderService } from './application/services/service-finder.service';
import { CreateServiceUseCase } from './application/use-cases/create-service.use-case';
import { UpdateServiceUseCase } from './application/use-cases/update-service.use-case';
import { ApproveServiceUseCase } from './application/use-cases/approve-service.use-case';
import { RejectServiceUseCase } from './application/use-cases/reject-service.use-case';
import { ListPublicServicesUseCase } from './application/use-cases/list-public-services.use-case';
import { ListMyServicesUseCase } from './application/use-cases/list-my-services.use-case';
import { ListAdminServicesUseCase } from './application/use-cases/list-admin-services.use-case';
import { FindServiceByIdUseCase } from './application/use-cases/find-service-by-id.use-case';
import { ServiceController } from './presentation/controllers/service.controller';

@Module({
  controllers: [ServiceController],
  providers: [
    {
      provide: ServiceRepository,
      useClass: PrismaServiceRepository,
    },
    ServiceFinderService,
    CreateServiceUseCase,
    UpdateServiceUseCase,
    ApproveServiceUseCase,
    RejectServiceUseCase,
    ListPublicServicesUseCase,
    ListMyServicesUseCase,
    ListAdminServicesUseCase,
    FindServiceByIdUseCase,
  ],
  exports: [ServiceRepository],
})
export class ServicesModule {}
