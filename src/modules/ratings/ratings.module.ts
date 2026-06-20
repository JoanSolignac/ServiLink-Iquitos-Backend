import { Module } from '@nestjs/common';
import { PrismaModule } from '@prisma/prisma.module';
import { RatingsController } from './ratings.controller';
import { CreateRatingFeature } from './features/create-rating.feature';
import { UpdateRatingFeature } from './features/update-rating.feature';
import { DeleteRatingFeature } from './features/delete-rating.feature';

@Module({
  imports: [PrismaModule],
  controllers: [RatingsController],
  providers: [CreateRatingFeature, UpdateRatingFeature, DeleteRatingFeature],
})
export class RatingsModule {}
