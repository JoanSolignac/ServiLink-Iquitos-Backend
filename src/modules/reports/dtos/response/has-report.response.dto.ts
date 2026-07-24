import { ApiProperty } from '@nestjs/swagger';

export class HasReportResponseDto {
  @ApiProperty({ example: false })
  hasReport: boolean;
}
