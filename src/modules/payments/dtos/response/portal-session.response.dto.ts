import { ApiProperty } from '@nestjs/swagger';

export class PortalSessionResponseDto {
  @ApiProperty({
    description:
      'Stripe Billing Portal URL for the user to manage their subscription',
    example: 'https://billing.stripe.com/p/session/test_...',
  })
  declare url: string;
}
