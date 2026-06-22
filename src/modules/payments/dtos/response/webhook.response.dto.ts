import { ApiProperty } from '@nestjs/swagger';

export class WebhookResponseDto {
  @ApiProperty({
    description: 'Acknowledgement that the webhook event was received',
    example: true,
  })
  declare received: boolean;
}
