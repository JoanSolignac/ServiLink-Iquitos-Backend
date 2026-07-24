import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class CheckPhoneExistsFeature {
  constructor(private readonly prisma: PrismaService) {}

  async execute(phone: string): Promise<boolean> {
    const profile = await this.prisma.profile.findFirst({
      where: { phone },
      select: { userId: true },
    });
    return profile !== null;
  }
}
