import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { Profile } from '@prisma/client';
import { ensureProfileNotExistsByUserId } from '@modules/profiles/utils/profile.util';

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

    return this.prisma.profile.update({
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
  }
}
