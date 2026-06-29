import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReportedUserItemResponseDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  fullName: string;

  @ApiPropertyOptional({ nullable: true })
  profilePictureUrl: string | null;

  @ApiProperty()
  email: string;

  @ApiProperty()
  pendingReportCount: number;
}
