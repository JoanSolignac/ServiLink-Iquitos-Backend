import {
  Controller,
  Post,
  Headers,
  Req,
  Res,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';
import { UseAuth } from '@common/decorators/use-auth.decorator';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import type { AuthCurrentUser } from '@common/interfaces/auth-current-user.interface';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { CreateCheckoutSessionFeature } from './features/create-checkout-session.feature';
import { CreatePortalSessionFeature } from './features/create-portal-session.feature';
import { StripeWebhookFeature } from './features/stripe-webhook.feature';
import { CheckoutSessionResponseDto } from './dtos/response/checkout-session.response.dto';
import { PortalSessionResponseDto } from './dtos/response/portal-session.response.dto';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(
    private readonly createCheckoutSessionFeature: CreateCheckoutSessionFeature,
    private readonly createPortalSessionFeature: CreatePortalSessionFeature,
    private readonly stripeWebhookFeature: StripeWebhookFeature,
    private readonly configService: ConfigService,
  ) {}

  @Post('checkout-session')
  @UseAuth()
  @ApiBearerAuth('bearer')
  @ApiOperation({
    summary: 'Create a Stripe Checkout Session for the premium subscription',
  })
  @ApiResponse({
    status: 201,
    description: 'Checkout session created successfully',
    type: CheckoutSessionResponseDto,
  })
  async createCheckoutSession(
    @CurrentUser() user: AuthCurrentUser,
  ): Promise<CheckoutSessionResponseDto> {
    const url = await this.createCheckoutSessionFeature.execute(user.id);
    return { url };
  }

  @Post('portal-session')
  @UseAuth()
  @ApiBearerAuth('bearer')
  @ApiOperation({
    summary:
      'Create a Stripe Billing Portal Session for subscription management',
  })
  @ApiResponse({
    status: 201,
    description: 'Billing portal session created successfully',
    type: PortalSessionResponseDto,
  })
  async createPortalSession(
    @CurrentUser() user: AuthCurrentUser,
  ): Promise<PortalSessionResponseDto> {
    const url = await this.createPortalSessionFeature.execute(user.id);
    return { url };
  }

  @Post('webhook')
  @ApiExcludeEndpoint()
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
    @Res() res: Response,
  ): Promise<void> {
    const webhookSecret = this.configService.getOrThrow<string>(
      'STRIPE_WEBHOOK_SECRET',
    );

    const rawBody = req.rawBody;

    if (!rawBody) {
      this.logger.error(
        'Missing raw request body buffer. Ensure NestFactory is initialized with rawBody: true.',
      );
      res.status(HttpStatus.BAD_REQUEST).send('Missing raw request body');
      return;
    }

    try {
      await this.stripeWebhookFeature.execute(
        rawBody,
        signature,
        webhookSecret,
      );
      res.status(HttpStatus.OK).send({ received: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      this.logger.error(`Webhook execution failed: ${message}`);
      res.status(HttpStatus.BAD_REQUEST).send(`Webhook Error: ${message}`);
    }
  }
}
