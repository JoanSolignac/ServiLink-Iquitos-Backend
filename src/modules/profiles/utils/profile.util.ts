import { Profile } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.service';
import { ProfileNotFoundException } from '@modules/profiles/exceptions/profile-not-found.exception';

export const ensureProfileNotExistsByUserId = async (
  prisma: PrismaService,
  userId: string,
): Promise<Profile> => {
  const profile = await prisma.profile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new ProfileNotFoundException();
  }

  return profile;
};
