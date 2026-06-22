import { Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import type { AuthCurrentUser } from '@common/interfaces/auth-current-user.interface';
import { UseAuth } from '@common/decorators/use-auth.decorator';
import { MeResponseDto } from './dtos/response/me.response.dto';
import { VerificationEmailResponseDto } from './dtos/response/verification-email.response.dto';
import { SendVerificationEmailFeature } from './features/send-verification-email.feature';

@ApiTags('Auth')
@ApiBearerAuth('bearer')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly sendVerificationEmailFeature: SendVerificationEmailFeature,
  ) {}

  @Get('me')
  @UseAuth()
  @ApiOperation({ summary: 'Get current authenticated user information' })
  @ApiResponse({
    status: 200,
    description: 'Current user data',
    type: MeResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  me(@CurrentUser() authCurrentUser: AuthCurrentUser): MeResponseDto {
    return {
      id: authCurrentUser.id,
      role: authCurrentUser.role,
      email: authCurrentUser.email,
      hasProfile: authCurrentUser.hasProfile,
      emailVerified: authCurrentUser.emailVerified,
      isPremium: authCurrentUser.isPremium,
    };
  }

  @Post('verification-email')
  @UseAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Resend Auth0 email verification to the current user',
  })
  @ApiResponse({
    status: 200,
    description: 'Verification email sent',
    type: VerificationEmailResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 409, description: 'Email already verified' })
  @ApiResponse({ status: 502, description: 'Auth0 Management API error' })
  async sendVerificationEmail(
    @CurrentUser() authCurrentUser: AuthCurrentUser,
  ): Promise<VerificationEmailResponseDto> {
    await this.sendVerificationEmailFeature.execute(authCurrentUser);
    return { message: 'Verification email sent.' };
  }
}
