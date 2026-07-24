import {
  Controller,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import type { AuthCurrentUser } from '@common/interfaces/auth-current-user.interface';
import { UseAuth } from '@common/decorators/use-auth.decorator';
import { CreateRatingFeature } from './features/create-rating.feature';
import { UpdateRatingFeature } from './features/update-rating.feature';
import { DeleteRatingFeature } from './features/delete-rating.feature';
import { CreateRatingRequestDto } from './dtos/request/create-rating.request.dto';
import { UpdateRatingRequestDto } from './dtos/request/update-rating.request.dto';
import { RatingResponseDto } from './dtos/response/rating.response.dto';

@ApiTags('Ratings')
@ApiBearerAuth('bearer')
@Controller()
export class RatingsController {
  constructor(
    private readonly createRatingFeature: CreateRatingFeature,
    private readonly updateRatingFeature: UpdateRatingFeature,
    private readonly deleteRatingFeature: DeleteRatingFeature,
  ) {}

  @Post('services/:id/rating')
  @UseAuth(UserRole.USER)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Rate a service (one rating per user per service)' })
  @ApiParam({
    name: 'id',
    description: 'Service ID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiBody({ type: CreateRatingRequestDto })
  @ApiResponse({
    status: 201,
    description: 'Rating created successfully',
    type: RatingResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden — cannot rate your own service',
  })
  @ApiResponse({
    status: 409,
    description: 'Rating already exists for this service',
  })
  async create(
    @CurrentUser() authCurrentUser: AuthCurrentUser,
    @Param('id') id: string,
    @Body() dto: CreateRatingRequestDto,
  ): Promise<RatingResponseDto> {
    return this.createRatingFeature.execute(
      id,
      authCurrentUser.id,
      dto.score,
      dto.comment,
    );
  }

  @Patch('services/:id/rating')
  @UseAuth(UserRole.USER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update your rating for a service' })
  @ApiParam({
    name: 'id',
    description: 'Service ID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiBody({ type: UpdateRatingRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Rating updated successfully',
    type: RatingResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Rating not found' })
  async update(
    @CurrentUser() authCurrentUser: AuthCurrentUser,
    @Param('id') id: string,
    @Body() dto: UpdateRatingRequestDto,
  ): Promise<RatingResponseDto> {
    return this.updateRatingFeature.execute(
      id,
      authCurrentUser.id,
      dto.score,
      dto.comment,
    );
  }

  @Delete('services/:id/rating')
  @UseAuth(UserRole.USER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete your rating for a service' })
  @ApiParam({
    name: 'id',
    description: 'Service ID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({ status: 204, description: 'Rating deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Rating not found' })
  async delete(
    @CurrentUser() authCurrentUser: AuthCurrentUser,
    @Param('id') id: string,
  ): Promise<void> {
    return this.deleteRatingFeature.execute(id, authCurrentUser.id);
  }
}
