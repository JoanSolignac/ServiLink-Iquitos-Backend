import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ServiceReportItemResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  subject: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ enum: ['PENDING', 'REVIEWED'] })
  status: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  reporterFullName: string;

  @ApiPropertyOptional({ nullable: true })
  reporterPictureUrl: string | null;
}
