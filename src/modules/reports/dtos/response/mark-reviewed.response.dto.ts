import { ApiProperty } from '@nestjs/swagger';

export class MarkReviewedResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: ['PENDING', 'REVIEWED'] })
  status: string;
}
