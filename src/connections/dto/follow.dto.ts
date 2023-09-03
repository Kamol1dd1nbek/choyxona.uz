import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class FollowDto {
  @ApiProperty({ example: 1, description: 'Follow to user (id: 1)' })
  @IsNotEmpty()
  @IsNumber()
  to: number;
}
