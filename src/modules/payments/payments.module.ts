import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PaymentsController } from './payments.controller';
import { CreateCheckoutSessionFeature } from './features/create-checkout-session.feature';
import { CreatePortalSessionFeature } from './features/create-portal-session.feature';
import { StripeWebhookFeature } from './features/stripe-webhook.feature';
import { PrismaModule } from '@prisma/prisma.module';
import { STRIPE_CLIENT } from './payments.constants';

@Module({
  imports: [ConfigModule, PrismaModule],
  controllers: [PaymentsController],
  providers: [
    {
      provide: STRIPE_CLIENT,
      useFactory: (configService: ConfigService): Stripe => {
        return new Stripe(
          configService.getOrThrow<string>('STRIPE_SECRET_KEY'),
          { apiVersion: '2026-05-27.dahlia' },
        );
      },
      inject: [ConfigService],
    },
    CreateCheckoutSessionFeature,
    CreatePortalSessionFeature,
    StripeWebhookFeature,
  ],
  exports: [STRIPE_CLIENT],
})
export class PaymentsModule {}
