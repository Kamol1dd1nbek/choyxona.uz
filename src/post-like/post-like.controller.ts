import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { PostLikeService } from './post-like.service';
import { GetCurrentUserId } from '../common/decorators/get-current-user-id.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags("Like to post")
@Controller('post-like')
export class PostLikeController {
  constructor(private readonly postLikeService: PostLikeService) {}

  @ApiOperation({ summary: "| Like or dislike to post" })
  @Post(":id")
  @HttpCode(HttpStatus.OK)
  loke(
    @GetCurrentUserId() user_id: number,
    @Param("id") post_id: string) {
    return this.postLikeService.like(user_id, +post_id);
  }
}