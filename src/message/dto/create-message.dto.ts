import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({ example: 2, description: 'Message being replied to' })
  forward_to?: number;

  @ApiProperty({ example: 'Assalomu aleykum', description: 'Message: text' })
  @IsNotEmpty()
  @IsString()
  text: string;

  @ApiProperty({ example: 4, description: 'Message: chat id' })
  @IsNotEmpty()
  @IsNumber()
  chat_id: number;
}
