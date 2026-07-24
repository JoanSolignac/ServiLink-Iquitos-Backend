import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class CheckEmailExistsFeature {
  constructor(private readonly prisma: PrismaService) {}

  async execute(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    return user !== null;
  }
}
