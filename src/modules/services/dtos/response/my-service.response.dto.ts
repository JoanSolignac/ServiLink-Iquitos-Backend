import { ApiProperty } from '@nestjs/swagger';
import { ServiceStatus } from '@prisma/client';

export class MyServiceResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  declare serviceId: string;

  @ApiProperty({ example: 'Plumbing Repair' })
  declare title: string;

  @ApiProperty({ example: 'Fix leaks and broken pipes' })
  declare description: string;

  @ApiProperty({ example: ['plumbing', 'repair'], type: [String] })
  declare keywords: string[];

  @ApiProperty({ example: 45.5 })
  declare price: number;

  @ApiProperty({ enum: ServiceStatus, example: ServiceStatus.REQUIRE_REVIEW })
  declare status: ServiceStatus;
}
