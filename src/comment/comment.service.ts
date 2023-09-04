import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentService {
  constructor(private readonly prismaService: PrismaService) {}

  async write(userId: number, createCommentDto: CreateCommentDto) {
    const { replyed_to, text, post_id } = createCommentDto;
    const post = await this.prismaService.post.findFirst({
      where: {
        id: post_id,
      },
    });
    if (!post) {
      throw new BadRequestException('Post not found');
    }
    const newComment = await this.prismaService.comment.create({
      data: {
        replyed_comment_id: replyed_to,
        user_id: userId,
        text,
        post_id,
      },
    });
    return newComment;
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    const { text, comment_id } = updateCommentDto;
    const comment = await this.prismaService.comment.findFirst({
      where: {
        id: comment_id,
        user_id: id,
      },
    });
    if (!comment) throw new NotFoundException('Comment not found');
    await this.prismaService.comment.update({
      data: {
        text,
      },
      where: {
        id: comment.id,
      },
    });
    return { status: 'Ok', message: 'Successfully updated' };
  }
}
