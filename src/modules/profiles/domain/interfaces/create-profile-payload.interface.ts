import { UserId } from '../../../users/domain/value-objects/user-id.value-object';

export interface CreateProfilePayload {
  userId: UserId;
  firstName: string;
  lastName: string;
  birthDate: Date;
  phone?: string | null;
  address?: string | null;
  bio?: string | null;
  pictureFile?: {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
  } | null;
}
