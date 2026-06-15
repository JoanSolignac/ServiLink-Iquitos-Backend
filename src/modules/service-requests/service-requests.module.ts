import { Module } from '@nestjs/common';
import { PrismaModule } from '@prisma/prisma.module';
import { ServiceRequestsController } from './service-requests.controller';
import { ListSentRequestsFeature } from './features/list-sent-requests.feature';
import { ListReceivedRequestsFeature } from './features/list-received-requests.feature';
import { CreateServiceRequestFeature } from './features/create-service-request.feature';
import { AcceptServiceRequestFeature } from './features/accept-service-request.feature';
import { RejectServiceRequestFeature } from './features/reject-service-request.feature';
import { CancelServiceRequestFeature } from './features/cancel-service-request.feature';
import { FinishServiceRequestFeature } from './features/finish-service-request.feature';
import { ConfirmServiceRequestFeature } from './features/confirm-service-request.feature';
import { GetServiceRequestByIdFeature } from './features/get-service-request-by-id.feature';

@Module({
  imports: [PrismaModule],
  controllers: [ServiceRequestsController],
  providers: [
    ListSentRequestsFeature,
    ListReceivedRequestsFeature,
    CreateServiceRequestFeature,
    AcceptServiceRequestFeature,
    RejectServiceRequestFeature,
    CancelServiceRequestFeature,
    FinishServiceRequestFeature,
    ConfirmServiceRequestFeature,
    GetServiceRequestByIdFeature,
  ],
})
export class ServiceRequestsModule {}
