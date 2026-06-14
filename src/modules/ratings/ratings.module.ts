import { Module } from '@nestjs/common';
import { PrismaModule } from '@prisma/prisma.module';
import { RatingsController } from './ratings.controller';
import { CreateRatingFeature } from './features/create-rating.feature';
import { CreateRatingByServiceFeature } from './features/create-rating-by-service.feature';

@Module({
  imports: [PrismaModule],
  controllers: [RatingsController],
  providers: [CreateRatingFeature, CreateRatingByServiceFeature],
})
export class RatingsModule {}
