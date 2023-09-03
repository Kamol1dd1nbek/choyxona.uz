import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateChatDto {
  @ApiProperty({ example: '1', description: 'First user: id' })
  @IsNotEmpty()
  @IsNumber()
  first_id: number;

  @ApiProperty({ example: '2', description: 'Second user: id' })
  @IsNotEmpty()
  @IsNumber()
  second_id: number;
}
