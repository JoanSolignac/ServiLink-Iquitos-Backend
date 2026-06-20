import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import type { AuthCurrentUser } from '@common/interfaces/auth-current-user.interface';
import { UseAuth } from '@common/decorators/use-auth.decorator';
import { AddFavoriteFeature } from './features/add-favorite.feature';
import { RemoveFavoriteFeature } from './features/remove-favorite.feature';
import { ListMyFavoritesFeature } from './features/list-my-favorites.feature';
import { ListFavoritesQueryDto } from './dtos/request/list-favorites.query.dto';
import { FavoriteServicePaginatedResponseDto } from './dtos/response/favorite-service-paginated.response.dto';

@ApiTags('Favorites')
@ApiBearerAuth('bearer')
@Controller()
export class FavoritesController {
  constructor(
    private readonly addFavoriteFeature: AddFavoriteFeature,
    private readonly removeFavoriteFeature: RemoveFavoriteFeature,
    private readonly listMyFavoritesFeature: ListMyFavoritesFeature,
  ) {}

  @Post('services/:id/favorite')
  @UseAuth(UserRole.USER)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add a service to favorites' })
  @ApiParam({
    name: 'id',
    description: 'Service ID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({ status: 201, description: 'Service added to favorites' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden — service not available or own service',
  })
  @ApiResponse({ status: 409, description: 'Service already in favorites' })
  async add(
    @CurrentUser() authCurrentUser: AuthCurrentUser,
    @Param('id') id: string,
  ): Promise<void> {
    return this.addFavoriteFeature.execute(id, authCurrentUser.id);
  }

  @Delete('services/:id/favorite')
  @UseAuth(UserRole.USER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a service from favorites' })
  @ApiParam({
    name: 'id',
    description: 'Service ID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({ status: 204, description: 'Service removed from favorites' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Favorite not found' })
  async remove(
    @CurrentUser() authCurrentUser: AuthCurrentUser,
    @Param('id') id: string,
  ): Promise<void> {
    return this.removeFavoriteFeature.execute(id, authCurrentUser.id);
  }

  @Get('favorites')
  @UseAuth(UserRole.USER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List my favorite services (paginated)' })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of favorite services',
    type: FavoriteServicePaginatedResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async listMy(
    @CurrentUser() authCurrentUser: AuthCurrentUser,
    @Query() query: ListFavoritesQueryDto,
  ): Promise<FavoriteServicePaginatedResponseDto> {
    return this.listMyFavoritesFeature.execute(
      authCurrentUser.id,
      query.page ?? 1,
      query.limit ?? 10,
    );
  }
}
