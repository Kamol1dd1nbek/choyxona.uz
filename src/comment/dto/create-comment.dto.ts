import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: 2, description: 'Post: id' })
  @IsNotEmpty()
  @IsNumber()
  post_id: number;

  @ApiProperty({ example: 2, description: 'Comment: text' })
  @IsNotEmpty()
  @IsString()
  text: string;

  @ApiProperty({ example: 2, description: 'Post: id' })
  replyed_to: number;
}
