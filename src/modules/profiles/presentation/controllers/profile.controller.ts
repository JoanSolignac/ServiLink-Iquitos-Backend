import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from '../../../auth/infrastructure/security/decorators/current-user.decorator';
import type { AuthCurrentUser } from '../../../auth/domain/interfaces/auth-current-user.interface';
import { UseAuth } from '../../../auth/infrastructure/security/decorators/use-auth.decorator';
import { CreateProfileRequestDto } from '../dto/request/create-profile.request.dto';
import { UpdateProfileRequestDto } from '../dto/request/update-profile.request.dto';
import { ProfileResponseDto } from '../dto/response/profile.response.dto';
import { toResponseProfile } from '../presenters/profile.presenter';
import { ProfilePictureValidationPipe } from '../pipes/profile-picture-validation.pipe';
import { CreateProfileUseCase } from '../../application/use-cases/create-profile.use-case';
import { UpdateProfileUseCase } from '../../application/use-cases/update-profile.use-case';
import { FindProfileByUserIdUseCase } from '../../application/use-cases/find-profile-by-user-id.use-case';
import { UserId } from '../../../users/domain/value-objects/user-id.value-object';

@Controller('profiles')
export class ProfileController {
  constructor(
    private readonly createProfileUseCase: CreateProfileUseCase,
    private readonly updateProfileUseCase: UpdateProfileUseCase,
    private readonly findProfileByUserIdUseCase: FindProfileByUserIdUseCase,
  ) {}

  @Post()
  @UseAuth()
  @UseInterceptors(FileInterceptor('profilePicture'))
  async create(
    @CurrentUser() authCurrentUser: AuthCurrentUser,
    @Body() dto: CreateProfileRequestDto,
    @UploadedFile(ProfilePictureValidationPipe)
    pictureFile: {
      buffer: Buffer;
      originalname: string;
      mimetype: string;
    } | null,
  ): Promise<ProfileResponseDto> {
    const profile = await this.createProfileUseCase.execute({
      userId: authCurrentUser.id,
      firstName: dto.firstName,
      lastName: dto.lastName,
      birthDate: dto.birthDate,
      phone: dto.phone ?? null,
      address: dto.address ?? null,
      bio: dto.bio ?? null,
      pictureFile: pictureFile,
    });

    return toResponseProfile(profile);
  }

  @Get('me')
  @UseAuth()
  async me(
    @CurrentUser() authCurrentUser: AuthCurrentUser,
  ): Promise<ProfileResponseDto> {
    const profile = await this.findProfileByUserIdUseCase.execute(
      authCurrentUser.id,
    );

    if (!profile) {
      // Esto no debería ocurrir si el frontend redirige al formulario,
      // pero retornamos 404 implícito al no encontrar perfil.
      // Sin embargo, el use case retorna null; podríamos manejarlo aquí.
      // Dado que el flujo es: auth/me dice si tiene perfil, luego el frontend
      // crea el perfil, no debería pasar. Pero por robustez:
      // Dejamos que Nest maneje null como 404 si es necesario.
      // Por ahora, asumimos que siempre existe cuando se llama aquí.
      throw new NotFoundException('Profile not found');
    }

    return toResponseProfile(profile);
  }

  @Get(':userId')
  @UseAuth()
  async findByUserId(
    @Param('userId') userId: string,
  ): Promise<ProfileResponseDto> {
    const profile = await this.findProfileByUserIdUseCase.execute(
      UserId.from(userId),
    );

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return toResponseProfile(profile);
  }

  @Patch('me')
  @UseAuth()
  @UseInterceptors(FileInterceptor('profilePicture'))
  async update(
    @CurrentUser() authCurrentUser: AuthCurrentUser,
    @Body() dto: UpdateProfileRequestDto,
    @UploadedFile(ProfilePictureValidationPipe)
    pictureFile: {
      buffer: Buffer;
      originalname: string;
      mimetype: string;
    } | null,
  ): Promise<ProfileResponseDto> {
    const profile = await this.updateProfileUseCase.execute({
      userId: authCurrentUser.id,
      firstName: dto.firstName,
      lastName: dto.lastName,
      birthDate: dto.birthDate,
      phone: dto.phone ?? null,
      address: dto.address ?? null,
      bio: dto.bio ?? null,
      pictureFile: pictureFile,
    });

    return toResponseProfile(profile);
  }
}
