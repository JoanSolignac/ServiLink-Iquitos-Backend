import { Module } from '@nestjs/common';
import { PrismaModule } from '@prisma/prisma.module';
import { FavoritesController } from './favorites.controller';
import { AddFavoriteFeature } from './features/add-favorite.feature';
import { RemoveFavoriteFeature } from './features/remove-favorite.feature';
import { ListMyFavoritesFeature } from './features/list-my-favorites.feature';
import { CheckFavoriteExistsFeature } from './features/check-favorite-exists.feature';

@Module({
  imports: [PrismaModule],
  controllers: [FavoritesController],
  providers: [
    AddFavoriteFeature,
    RemoveFavoriteFeature,
    ListMyFavoritesFeature,
    CheckFavoriteExistsFeature,
  ],
})
export class FavoritesModule {}
