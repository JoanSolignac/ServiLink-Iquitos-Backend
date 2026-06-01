import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { ServicesController } from './services.controller';
import { CreateServiceFeature } from './features/create-service.feature';
import { UpdateServiceFeature } from './features/update-service.feature';
import { ApproveServiceFeature } from './features/approve-service.feature';
import { RejectServiceFeature } from './features/reject-service.feature';
import { FindServiceByIdFeature } from './features/find-service-by-id.feature';
import { ListPublicServicesFeature } from './features/list-public-services.feature';
import { ListMyServicesFeature } from './features/list-my-services.feature';
import { ListAdminServicesFeature } from './features/list-admin-services.feature';

@Module({
  imports: [PrismaModule],
  controllers: [ServicesController],
  providers: [
    CreateServiceFeature,
    UpdateServiceFeature,
    ApproveServiceFeature,
    RejectServiceFeature,
    FindServiceByIdFeature,
    ListPublicServicesFeature,
    ListMyServicesFeature,
    ListAdminServicesFeature,
  ],
})
export class ServicesModule {}
