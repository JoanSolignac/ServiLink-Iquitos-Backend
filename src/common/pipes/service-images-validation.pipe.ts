import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

export interface ValidatedImageFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];
const MAX_SIZE_BYTES = 6 * 1024 * 1024; // 6 MB
const MAX_FILES = 5;

@Injectable()
export class ServiceImagesValidationPipe implements PipeTransform {
  transform(value: unknown): ValidatedImageFile[] {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      return [];
    }

    const files = (
      Array.isArray(value) ? value : [value]
    ) as Express.Multer.File[];

    if (files.length > MAX_FILES) {
      throw new BadRequestException(
        `A service can have at most ${MAX_FILES} images`,
      );
    }

    return files.map((file) => {
      if (!file.mimetype || !ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        throw new BadRequestException(
          'Service images must be .jpg, .jpeg, .png or .webp files',
        );
      }

      if (file.size > MAX_SIZE_BYTES) {
        throw new BadRequestException(
          'Each service image must not exceed 6 MB',
        );
      }

      return {
        buffer: file.buffer,
        originalname: file.originalname,
        mimetype: file.mimetype,
      };
    });
  }
}
