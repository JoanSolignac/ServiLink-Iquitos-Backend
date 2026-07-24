import { ApiProperty } from '@nestjs/swagger';

export class CheckoutSessionResponseDto {
  @ApiProperty({
    description: 'Stripe Checkout URL to redirect the user to complete payment',
    example: 'https://checkout.stripe.com/c/pay/cs_test_...',
  })
  declare url: string;
}
