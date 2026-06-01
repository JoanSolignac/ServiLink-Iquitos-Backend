import { User } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.service';
import { UserNotFoundException } from '@modules/users/exceptions/user-not-found.exception';

export const ensureUserExistsById = async (
  prisma: PrismaService,
  userId: string,
): Promise<User> => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new UserNotFoundException();
  }

  return user;
};

export const ensureUserExistsByEmail = async (
  prisma: PrismaService,
  userEmail: string,
): Promise<User> => {
  const user = await prisma.user.findUnique({ where: { email: userEmail } });
  if (!user) {
    throw new UserNotFoundException();
  }

  return user;
};
