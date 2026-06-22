import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { ServiceStatus } from '@prisma/client';
import { ServiceNotFoundException } from '../exceptions/service-not-found.exception';
import { ServiceUnauthorizedException } from '../exceptions/service-unauthorized.exception';
import { UpdateServiceInput } from '../types/update-service-input.type';

const MAX_IMAGES = 5;

@Injectable()
export class UpdateServiceFeature {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    input: UpdateServiceInput,
  ): Promise<{ urlsToDelete: string[] }> {
    const existing = await this.prisma.service.findUnique({
      where: { id: input.serviceId },
      select: { userId: true, imageUrls: true },
    });

    if (!existing) {
      throw new ServiceNotFoundException();
    }

    if (existing.userId !== input.requestingUserId) {
      throw new ServiceUnauthorizedException();
    }

    const touchingImages =
      input.keepImageUrls !== undefined || input.newImageUrls !== undefined;

    let finalImageUrls = existing.imageUrls;
    let urlsToDelete: string[] = [];

    if (touchingImages) {
      const kept = input.keepImageUrls ?? existing.imageUrls;
      const added = input.newImageUrls ?? [];

      finalImageUrls = [...kept, ...added];

      if (finalImageUrls.length > MAX_IMAGES) {
        throw new BadRequestException(
          `A service can have at most ${MAX_IMAGES} images`,
        );
      }

      urlsToDelete = existing.imageUrls.filter(
        (url) => !finalImageUrls.includes(url),
      );
    }

    await this.prisma.service.update({
      where: { id: input.serviceId },
      data: {
        title: input.title,
        description: input.description,
        price: input.price,
        pricingUnit: input.pricingUnit,
        keywords: input.keywords,
        imageUrls: finalImageUrls,
        status: ServiceStatus.REQUIRE_REVIEW,
      },
    });

    return { urlsToDelete };
  }
}
