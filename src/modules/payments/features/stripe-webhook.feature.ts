import {
  Injectable,
  Inject,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import Stripe from 'stripe';
import { STRIPE_CLIENT } from '../payments.constants';

@Injectable()
export class StripeWebhookFeature {
  private readonly logger = new Logger(StripeWebhookFeature.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(STRIPE_CLIENT) private readonly stripe: Stripe,
  ) {}

  async execute(
    rawBody: Buffer,
    signature: string,
    webhookSecret: string,
  ): Promise<void> {
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret,
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      this.logger.error(`Signature verification failed: ${message}`);
      throw new BadRequestException(
        `Webhook signature verification failed: ${message}`,
      );
    }

    this.logger.log(`Processing event: ${event.type}`);

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await this.handleSubscriptionUpsert(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object);
        break;

      default:
        this.logger.log(`Unhandled event type: ${event.type}`);
    }
  }

  private async handleSubscriptionUpsert(
    subscription: Stripe.Subscription,
  ): Promise<void> {
    const customerId = subscription.customer as string;
    const isPremium =
      subscription.status === 'active' || subscription.status === 'trialing';

    const user = await this.findUserByCustomerId(customerId);

    if (!user) {
      this.logger.warn(`No local user found for customer ${customerId}`);
      return;
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isPremium,
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscription.id,
      },
    });

    this.logger.log(`User ${user.id} premium status set to ${isPremium}`);
  }

  private async handleSubscriptionDeleted(
    subscription: Stripe.Subscription,
  ): Promise<void> {
    const customerId = subscription.customer as string;

    const user = await this.prisma.user.findUnique({
      where: { stripeCustomerId: customerId },
    });

    if (!user) {
      this.logger.warn(
        `No local user found for customer ${customerId} on cancellation`,
      );
      return;
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { isPremium: false, stripeSubscriptionId: null },
    });

    this.logger.log(`User ${user.id} marked as non-premium`);
  }

  /**
   * Resolves the local user for a Stripe customer. Falls back to the Stripe
   * customer's metadata (userId) or email when the customer id is not yet
   * persisted locally (e.g. subscription.created arriving before the DB write).
   */
  private async findUserByCustomerId(customerId: string) {
    const byCustomerId = await this.prisma.user.findUnique({
      where: { stripeCustomerId: customerId },
    });

    if (byCustomerId) {
      return byCustomerId;
    }

    const customer = await this.stripe.customers.retrieve(customerId);

    if (customer.deleted) {
      this.logger.error(`Customer ${customerId} has been deleted in Stripe`);
      return null;
    }

    if (customer.metadata?.userId) {
      return this.prisma.user.findUnique({
        where: { id: customer.metadata.userId },
      });
    }

    if (customer.email) {
      return this.prisma.user.findUnique({ where: { email: customer.email } });
    }

    return null;
  }
}
