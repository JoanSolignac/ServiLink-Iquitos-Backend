import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import type { AuthCurrentUser } from '@common/interfaces/auth-current-user.interface';
import { UseAuth } from '@common/decorators/use-auth.decorator';
import { CreateProfileRequestDto } from './dtos/request/create-profile.request.dto';
import { UpdateProfileRequestDto } from './dtos/request/update-profile.request.dto';
import { ProfileResponseDto } from './dtos/response/profile.response.dto';
import { ProfilePictureValidationPipe } from '@common/pipes/profile-picture-validation.pipe';
import { CreateProfileFeature } from './features/create-profile.feature';
import { UpdateProfileFeature } from './features/update-profile.feature';
import { FindProfileByUserIdFeature } from './features/find-profile-by-user-id.feature';
import { SupabaseStorageService } from '@supabase/services/supabase-storage.service';

function toResponseProfile(profile: {
  userId: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  profilePictureUrl: string | null;
  bio: string | null;
  phone: string | null;
  address: string | null;
  createdAt: Date;
  updatedAt: Date;
}): ProfileResponseDto {
  return {
    userId: profile.userId,
    firstName: profile.firstName,
    lastName: profile.lastName,
    birthDate: profile.birthDate,
    profilePictureUrl: profile.profilePictureUrl,
    bio: profile.bio,
    phone: profile.phone,
    address: profile.address,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
  };
}

function generateFileName(originalName: string): string {
  const ext = originalName.split('.').pop() || 'jpg';
  const date = new Date().toISOString().split('T')[0];
  const id = crypto.randomUUID();
  return `${date}-${id}.${ext}`;
}

@ApiTags('Profiles')
@ApiBearerAuth('bearer')
@Controller('profiles')
export class ProfilesController {
  constructor(
    private readonly createProfileFeature: CreateProfileFeature,
    private readonly updateProfileFeature: UpdateProfileFeature,
    private readonly findProfileByUserIdFeature: FindProfileByUserIdFeature,
    private readonly supabaseStorage: SupabaseStorageService,
  ) {}

  @Post()
  @UseAuth()
  @ApiOperation({ summary: 'Create a user profile' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateProfileRequestDto })
  @ApiResponse({
    status: 201,
    description: 'Profile created successfully',
    type: ProfileResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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
    let profilePictureUrl: string | null = null;

    if (pictureFile) {
      profilePictureUrl = await this.supabaseStorage.upload({
        file: pictureFile.buffer,
        fileName: generateFileName(pictureFile.originalname),
        contentType: pictureFile.mimetype,
        folder: 'profiles',
      });
    }

    const profile = await this.createProfileFeature.execute({
      userId: authCurrentUser.id,
      firstName: dto.firstName,
      lastName: dto.lastName,
      birthDate: dto.birthDate,
      phone: dto.phone ?? null,
      address: dto.address ?? null,
      bio: dto.bio ?? null,
      profilePictureUrl,
    });

    return toResponseProfile(profile);
  }

  @Get('me')
  @UseAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'Current user profile',
    type: ProfileResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async me(
    @CurrentUser() authCurrentUser: AuthCurrentUser,
  ): Promise<ProfileResponseDto> {
    const profile = await this.findProfileByUserIdFeature.execute(
      authCurrentUser.id,
    );

    return toResponseProfile(profile);
  }

  @Get(':userId')
  @UseAuth()
  @ApiOperation({ summary: 'Get a profile by user ID' })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    example: 'auth0|123456789',
  })
  @ApiResponse({
    status: 200,
    description: 'Profile found',
    type: ProfileResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findByUserId(
    @Param('userId') userId: string,
  ): Promise<ProfileResponseDto> {
    const profile = await this.findProfileByUserIdFeature.execute(userId);

    return toResponseProfile(profile);
  }

  @Patch('me')
  @UseAuth()
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateProfileRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
    type: ProfileResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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
    const existingProfile = await this.findProfileByUserIdFeature.execute(
      authCurrentUser.id,
    );

    let profilePictureUrl: string | null = existingProfile.profilePictureUrl;

    if (pictureFile) {
      const newPictureUrl = await this.supabaseStorage.upload({
        file: pictureFile.buffer,
        fileName: generateFileName(pictureFile.originalname),
        contentType: pictureFile.mimetype,
        folder: 'profiles',
      });

      if (existingProfile.profilePictureUrl) {
        await this.supabaseStorage
          .delete(existingProfile.profilePictureUrl)
          .catch(() => {
            // Silently fail if old image cannot be deleted
          });
      }

      profilePictureUrl = newPictureUrl;
    }

    const profile = await this.updateProfileFeature.execute({
      userId: authCurrentUser.id,
      firstName: dto.firstName,
      lastName: dto.lastName,
      birthDate: dto.birthDate,
      phone: dto.phone ?? null,
      address: dto.address ?? null,
      bio: dto.bio ?? null,
      profilePictureUrl,
    });

    return toResponseProfile(profile);
  }
}
