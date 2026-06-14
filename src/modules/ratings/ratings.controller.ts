import {
  Controller,
  Post,
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
import { CreateRatingByServiceFeature } from './features/create-rating-by-service.feature';
import { CreateRatingRequestDto } from './dtos/request/create-rating.request.dto';
import { RatingResponseDto } from './dtos/response/rating.response.dto';

@ApiTags('Ratings')
@ApiBearerAuth('bearer')
@Controller()
export class RatingsController {
  constructor(
    private readonly createRatingFeature: CreateRatingFeature,
    private readonly createRatingByServiceFeature: CreateRatingByServiceFeature,
  ) {}

  @Post('service-requests/:id/rating')
  @UseAuth(UserRole.USER)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Rate a service request by its ID' })
  @ApiParam({
    name: 'id',
    description: 'Service Request ID',
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
    description:
      'Forbidden — not the customer or request not in a rateable status',
  })
  @ApiResponse({
    status: 409,
    description: 'Rating already exists for this service request',
  })
  async createByServiceRequest(
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

  @Post('services/:id/rating')
  @UseAuth(UserRole.USER)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary:
      'Rate a service by its ID — finds the most recent eligible service request automatically',
  })
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
    description:
      'Forbidden — no eligible service request found (must be CONFIRMED or REJECTED and not yet rated)',
  })
  async createByService(
    @CurrentUser() authCurrentUser: AuthCurrentUser,
    @Param('id') id: string,
    @Body() dto: CreateRatingRequestDto,
  ): Promise<RatingResponseDto> {
    return this.createRatingByServiceFeature.execute(
      id,
      authCurrentUser.id,
      dto.score,
      dto.comment,
    );
  }
}
