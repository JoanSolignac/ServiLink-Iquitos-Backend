import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import type { AuthCurrentUser } from '@common/interfaces/auth-current-user.interface';
import { CurrentUser } from '@common/decorators/current-user.decorator';

import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

import { UseAuth } from '@common/decorators/use-auth.decorator';
import { ListUsersFeature } from './features/list-users.feature';
import { ChangeUserRoleFeature } from './features/change-user-role.feature';
import { CheckEmailExistsFeature } from './features/check-email-exists.feature';
import { BanUserFeature } from './features/ban-user.feature';
import { BanUserRequestDto } from './dtos/request/ban-user.request.dto';
import { BanUserResponseDto } from './dtos/response/ban-user.response.dto';
import { ListUsersQueryDto } from './dtos/request/list-users.query.dto';
import { ChangeUserRoleRequestDto } from './dtos/request/change-user-role.request.dto';
import { CheckEmailQueryDto } from './dtos/request/check-email.query.dto';
import { UserWithProfileResponseDto } from './dtos/response/user-with-profile.response.dto';
import { UserWithProfilePaginatedResponseDto } from './dtos/response/user-with-profile-paginated.response.dto';
import { CheckExistsResponseDto } from './dtos/response/check-exists.response.dto';
import { UserWithProfile } from './types/user-with-profile.type';

function toUserWithProfileResponse(
  user: UserWithProfile,
): UserWithProfileResponseDto {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    status: user.status,
    bannedUntil: user.bannedUntil,
    profileName: user.profile
      ? `${user.profile.firstName} ${user.profile.lastName}`
      : null,
    profilePictureUrl: user.profile?.profilePictureUrl ?? null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

@ApiTags('Users')
@ApiBearerAuth('bearer')
@Controller('users')
export class UsersController {
  constructor(
    private readonly listUsersFeature: ListUsersFeature,
    private readonly changeUserRoleFeature: ChangeUserRoleFeature,
    private readonly checkEmailExistsFeature: CheckEmailExistsFeature,
    private readonly banUserFeature: BanUserFeature,
  ) {}

  @Get('check-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verificar si un email ya está registrado' })
  @ApiResponse({ status: 200, type: CheckExistsResponseDto })
  async checkEmail(
    @Query() query: CheckEmailQueryDto,
  ): Promise<CheckExistsResponseDto> {
    const exists = await this.checkEmailExistsFeature.execute(query.email);
    return { exists };
  }

  @Get()
  @UseAuth(UserRole.ADMINISTRATOR)
  @ApiOperation({ summary: 'Listar usuarios con perfil (solo ADMINISTRATOR)' })
  @ApiResponse({
    status: 200,
    description: 'Listado paginado de usuarios con nombre de perfil',
    type: UserWithProfilePaginatedResponseDto,
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({
    status: 403,
    description: 'Prohibido — requiere ADMINISTRATOR',
  })
  async listUsers(
    @Query() query: ListUsersQueryDto,
    @CurrentUser() currentUser: AuthCurrentUser,
  ): Promise<UserWithProfilePaginatedResponseDto> {
    const result = await this.listUsersFeature.execute({
      page: query.page ?? 1,
      limit: query.limit ?? 10,
      search: query.search,
      excludeId: currentUser.id,
    });

    return {
      data: result.users.map(toUserWithProfileResponse),
      meta: {
        page: query.page ?? 1,
        limit: query.limit ?? 10,
        total: result.total,
      },
    };
  }

  @Patch(':id/ban')
  @UseAuth(UserRole.MODERATOR, UserRole.ADMINISTRATOR)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Banear un usuario temporal o indefinidamente (MODERATOR/ADMINISTRATOR)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del usuario a banear',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiBody({ type: BanUserRequestDto })
  @ApiResponse({ status: 200, type: BanUserResponseDto })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({
    status: 403,
    description: 'Prohibido — requiere MODERATOR o ADMINISTRATOR',
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiResponse({ status: 409, description: 'El usuario ya está suspendido' })
  async ban(
    @Param('id') id: string,
    @Body() dto: BanUserRequestDto,
  ): Promise<BanUserResponseDto> {
    const bannedUntil =
      dto.bannedUntil != null ? new Date(dto.bannedUntil) : null;
    return this.banUserFeature.execute({ userId: id, bannedUntil });
  }

  @Patch(':id/role')
  @UseAuth(UserRole.ADMINISTRATOR)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Cambiar rol de un usuario (solo ADMINISTRATOR)' })
  @ApiParam({
    name: 'id',
    description: 'ID del usuario',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiBody({ type: ChangeUserRoleRequestDto })
  @ApiResponse({ status: 204, description: 'Rol actualizado exitosamente' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({
    status: 403,
    description: 'Prohibido — requiere ADMINISTRATOR',
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiResponse({ status: 409, description: 'El usuario ya tiene ese rol' })
  async changeRole(
    @Param('id') id: string,
    @Body() dto: ChangeUserRoleRequestDto,
  ): Promise<void> {
    await this.changeUserRoleFeature.execute(id, dto.role);
  }
}
