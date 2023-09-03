import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateMessageDto {
  @ApiProperty({
    example: 'Va laeykum assalom',
    description: 'Text to be changed',
  })
  @IsNotEmpty()
  @IsString()
  text: string;

  @ApiProperty({ example: 5, description: 'Chat: id' })
  @IsNotEmpty()
  @IsNumber()
  chat_id: number;

  @ApiProperty({ example: 2, description: 'Message: id' })
  @IsNotEmpty()
  @IsNumber()
  message_id: number;
}
