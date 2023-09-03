import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateMessageDto } from './create-message.dto';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RemoveMessageDto {
  @ApiProperty({ example: 5, description: 'Chat: id' })
  @IsNotEmpty()
  @IsNumber()
  chat_id: number;

  @ApiProperty({ example: 2, description: 'Message: id' })
  @IsNotEmpty()
  @IsNumber()
  message_id: number;
}
