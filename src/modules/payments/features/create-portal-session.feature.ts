import { Injectable, Inject, Logger } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { UserNotFoundException } from '@modules/users/exceptions/user-not-found.exception';
import { STRIPE_CLIENT } from '../payments.constants';
import { StripeNoCustomerException } from '../exceptions/stripe-no-customer.exception';

@Injectable()
export class CreatePortalSessionFeature {
  private readonly logger = new Logger(CreatePortalSessionFeature.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    @Inject(STRIPE_CLIENT) private readonly stripe: Stripe,
  ) {}

  async execute(userId: string): Promise<string> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new UserNotFoundException();
    }

    if (!user.stripeCustomerId) {
      throw new StripeNoCustomerException();
    }

    const returnUrl =
      this.configService.get<string>('STRIPE_PORTAL_RETURN_URL') ??
      this.configService.getOrThrow<string>('STRIPE_SUCCESS_URL');

    const session = await this.stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: returnUrl,
    });

    this.logger.log(`Billing portal session created for user ${user.id}`);
    return session.url;
  }
}
