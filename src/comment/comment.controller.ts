import {
  Controller,
  Post,
  Body,
  Patch
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { GetCurrentUserId } from '../common/decorators/get-current-user-id.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags("Comment")
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiOperation({ summary: "| Write comment" })
  @Post()
  write(
    @GetCurrentUserId() userId: number,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentService.write(userId, createCommentDto);
  }

  @ApiOperation({ summary: "| Write comment" })
  @Patch()
  update(
    @GetCurrentUserId() userId: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentService.update(userId, updateCommentDto);
  }
}
