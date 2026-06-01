import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { Profile } from '@prisma/client';
import { ProfileAlreadyExistsException } from '../exceptions/profile-already-exists.exception';

type CreateProfileInput = {
  userId: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  phone: string | null;
  address: string | null;
  bio: string | null;
  profilePictureUrl: string | null;
};

@Injectable()
export class CreateProfileFeature {
  constructor(private readonly prisma: PrismaService) {}

  async execute(input: CreateProfileInput): Promise<Profile> {
    const existing = await this.prisma.profile.findUnique({
      where: { userId: input.userId },
    });

    if (existing) {
      throw new ProfileAlreadyExistsException();
    }

    return this.prisma.profile.create({
      data: {
        userId: input.userId,
        firstName: input.firstName,
        lastName: input.lastName,
        birthDate: input.birthDate,
        phone: input.phone,
        address: input.address,
        bio: input.bio,
        profilePictureUrl: input.profilePictureUrl,
      },
    });
  }
}
