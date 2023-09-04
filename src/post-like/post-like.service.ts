import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostLikeService {
  constructor(private readonly prismaService: PrismaService) {}

  async like(user_id: number, post_id: number) {
    const post = await this.prismaService.post.findFirst({
      where: {
        id: post_id
      }
    });

    if (!post) {
      throw new NotFoundException("Post not found");
    }
    const like = await this.prismaService.postLike.findFirst({
      where: {
        user_id,
        post_id
      }
    });
    if (like) {
      await this.prismaService.postLike.delete({
        where: {
          id: like.id
        }
      });
      return { status: "Ok", message: "Disliked" }
    } else {
      await this.prismaService.postLike.create({
        data: {
          user_id,
          post_id
        }
      });
      return { status: "Ok", message: "Liked" }
    }
  }

}
