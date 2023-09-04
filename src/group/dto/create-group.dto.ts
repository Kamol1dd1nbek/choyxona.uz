import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGroupDto {
  @ApiProperty({
    example: 'tashkent.uz official',
    description: 'Group unique name',
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}
