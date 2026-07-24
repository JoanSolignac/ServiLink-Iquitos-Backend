import { Injectable, Inject, Logger } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { UserNotFoundException } from '@modules/users/exceptions/user-not-found.exception';
import { STRIPE_CLIENT } from '../payments.constants';
import { StripeNoActivePriceException } from '../exceptions/stripe-no-active-price.exception';
import { StripeSessionFailedException } from '../exceptions/stripe-session-failed.exception';
import { SubscriptionAlreadyActiveException } from '../exceptions/subscription-already-active.exception';

@Injectable()
export class CreateCheckoutSessionFeature {
  private readonly logger = new Logger(CreateCheckoutSessionFeature.name);

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

    if (user.isPremium) {
      throw new SubscriptionAlreadyActiveException();
    }

    const stripeCustomerId = await this.resolveCustomerId(
      user.id,
      user.email,
      user.stripeCustomerId,
    );
    const priceId = await this.resolvePriceId();

    const successUrl =
      this.configService.getOrThrow<string>('STRIPE_SUCCESS_URL');
    const cancelUrl =
      this.configService.getOrThrow<string>('STRIPE_CANCEL_URL');

    const session = await this.stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { userId: user.id },
    });

    if (!session.url) {
      throw new StripeSessionFailedException();
    }

    this.logger.log(`Checkout session created for user ${user.id}`);
    return session.url;
  }

  private async resolveCustomerId(
    userId: string,
    email: string,
    existingCustomerId: string | null,
  ): Promise<string> {
    if (existingCustomerId) {
      return existingCustomerId;
    }

    const customer = await this.stripe.customers.create({
      email,
      metadata: { userId },
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: { stripeCustomerId: customer.id },
    });

    this.logger.log(
      `Created Stripe customer ${customer.id} for user ${userId}`,
    );
    return customer.id;
  }

  private async resolvePriceId(): Promise<string> {
    const priceId = this.configService.get<string>('STRIPE_PREMIUM_PRICE_ID');

    if (priceId && priceId !== 'price_placeholder') {
      return priceId;
    }

    // Fallback: resolve the active price dynamically from the configured product.
    const productId = this.configService.get<string>(
      'STRIPE_PREMIUM_PRODUCT_ID',
    );

    if (!productId) {
      throw new StripeNoActivePriceException();
    }

    const prices = await this.stripe.prices.list({
      product: productId,
      active: true,
      limit: 1,
    });

    if (prices.data.length === 0) {
      throw new StripeNoActivePriceException();
    }

    return prices.data[0].id;
  }
}
