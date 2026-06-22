import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { Prisma, Profile } from '@prisma/client';
import { ProfileAlreadyExistsException } from '../exceptions/profile-already-exists.exception';
import { PhoneAlreadyInUseException } from '../exceptions/phone-already-in-use.exception';

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

    try {
      return await this.prisma.profile.create({
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
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        const target = e.meta?.target as string[] | undefined;
        if (target?.includes('phone')) throw new PhoneAlreadyInUseException();
      }
      throw e;
    }
  }
}
