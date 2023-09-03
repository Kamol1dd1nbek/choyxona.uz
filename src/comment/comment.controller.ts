import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { GetCurrentUserId } from '../common/decorators/get-current-user-id.decorator';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  write(
    @GetCurrentUserId() userId: number,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentService.write(userId, createCommentDto);
  }
}
