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
    console.log('UpdateServiceFeature.execute: Starting execution', { input });

    console.log('UpdateServiceFeature.execute: Fetching existing service...');
    const existing = await this.prisma.service.findUnique({
      where: { id: input.serviceId },
      select: { userId: true, imageUrls: true },
    });

    if (!existing) {
      console.log('UpdateServiceFeature.execute: Error - Service not found', { serviceId: input.serviceId });
      throw new ServiceNotFoundException();
    }

    if (existing.userId !== input.requestingUserId) {
      console.log('UpdateServiceFeature.execute: Error - User not authorized', {
        ownerId: existing.userId,
        requestingUserId: input.requestingUserId,
      });
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
      console.log('UpdateServiceFeature.execute: Recalculating images', {
        kept,
        added,
        finalImageUrls,
      });

      if (finalImageUrls.length > MAX_IMAGES) {
        console.log('UpdateServiceFeature.execute: Error - Too many images', {
          count: finalImageUrls.length,
          max: MAX_IMAGES,
        });
        throw new BadRequestException(
          `A service can have at most ${MAX_IMAGES} images`,
        );
      }

      urlsToDelete = existing.imageUrls.filter(
        (url) => !finalImageUrls.includes(url),
      );
      console.log('UpdateServiceFeature.execute: Identified image URLs to delete', urlsToDelete);
    }

    console.log('UpdateServiceFeature.execute: Updating service in database...');
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
    console.log('UpdateServiceFeature.execute: Service updated successfully in database');

    console.log('UpdateServiceFeature.execute: Execution finished, returning', { urlsToDelete });
    return { urlsToDelete };
  }
}
