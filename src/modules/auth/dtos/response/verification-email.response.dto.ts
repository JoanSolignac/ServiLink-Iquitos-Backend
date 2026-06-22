import { ApiProperty } from '@nestjs/swagger';

export class VerificationEmailResponseDto {
  @ApiProperty({
    description: 'Confirmation message',
    example: 'Verification email sent.',
  })
  declare message: string;
}
