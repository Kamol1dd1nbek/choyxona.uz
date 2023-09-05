import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, Query } from '@nestjs/common';
import { PostService } from './post.service';import { CreatePostDto } from './dto';
import { GetCurrentUserId } from '../common/decorators/get-current-user-id.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@ApiTags("Posts")
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiOperation({ summary: "| Create post" })
  @Post()
  @UseInterceptors(FilesInterceptor("images"))
  create(
    @GetCurrentUserId() userId: number,
    @Body() createPostDto: CreatePostDto,
    @UploadedFiles() images: any[]
    ) {
    return this.postService.createPost(userId, createPostDto, images);
  }

  @Get()
  myPosts(
    @GetCurrentUserId() id: number
  ) {
    return this.postService.myPosts(id);
  }



  @ApiOperation({ summary: "| Remove post" })
  @Delete(':id')
  remove(@GetCurrentUserId() userId: number, @Param('id') id: string) {
    return this.postService.removePost(userId, +id);
  }

  @Post("search/:tag")
  globalSearch(
    @Param("tag") tag: string
  ) {
    return this.postService.globalSearch(tag);
  }
}
