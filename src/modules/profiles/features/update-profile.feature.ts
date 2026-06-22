import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { Prisma, Profile } from '@prisma/client';
import { ensureProfileNotExistsByUserId } from '@modules/profiles/utils/profile.util';
import { PhoneAlreadyInUseException } from '../exceptions/phone-already-in-use.exception';

type UpdateProfileInput = {
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
export class UpdateProfileFeature {
  constructor(private readonly prisma: PrismaService) {}

  async execute(input: UpdateProfileInput): Promise<Profile> {
    await ensureProfileNotExistsByUserId(this.prisma, input.userId);

    try {
      return await this.prisma.profile.update({
        where: { userId: input.userId },
        data: {
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
