import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCommentDto } from './create-comment.dto';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateCommentDto {
  @ApiProperty({ example: 2, description: 'Post: id' })
  @IsNotEmpty()
  @IsNumber()
  comment_id: number;

  @ApiProperty({ example: 2, description: 'Comment: text' })
  @IsNotEmpty()
  @IsString()
  text: string;
}
