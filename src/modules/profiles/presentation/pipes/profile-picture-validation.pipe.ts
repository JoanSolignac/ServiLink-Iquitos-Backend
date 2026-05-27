import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

export interface ValidatedPictureFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}

@Injectable()
export class ProfilePictureValidationPipe implements PipeTransform {
  private readonly allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
  ];
  private readonly maxSizeInBytes = 6 * 1024 * 1024; // 6 MB

  transform(value: unknown): ValidatedPictureFile | null {
    if (!value) {
      return null;
    }

    const file = value as Express.Multer.File;

    if (!file.mimetype || !this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Profile picture must be a .jpg, .jpeg, .png or .webp file',
      );
    }

    if (file.size > this.maxSizeInBytes) {
      throw new BadRequestException('Profile picture must not exceed 6 MB');
    }

    return {
      buffer: file.buffer,
      originalname: file.originalname,
      mimetype: file.mimetype,
    };
  }
}
