import { Controller, Get } from '@nestjs/common';
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

@ApiTags('Auth')
@ApiBearerAuth('bearer')
@Controller('auth')
export class AuthController {
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
    };
  }
}
