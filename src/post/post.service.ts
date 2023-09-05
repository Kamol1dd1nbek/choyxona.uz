import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FilesService } from '../files/files.service';
import { CreatePostDto } from './dto';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly fileService: FilesService,
  ) {}

  async createPost(
    userId: number,
    createPostDto: CreatePostDto,
    images: any[],
  ) {
    const { title, description, tags } = createPostDto;
    const tagsArry = tags.trim().split('#').slice(1);
    console.log(tagsArry);

    const post = await this.prismaService.post.create({
      data: {
        author_id: userId,
        title,
        description,
      },
    }); 

    tagsArry.forEach(async (tag) => {
      await this.prismaService.tag.create({
        data: {
          name: tag.trim(),
          post_id: post.id,
        },
      });
    });

    images.forEach(async (image) => {
      const fileName = await this.fileService.createFile(image, 'post');
      const content = await this.prismaService.content.create({
        data: {
          post_id: post.id,
          url: fileName,
        },
      });
    });
    return { message: 'Post successfully craeted', postId: post.id };
  }

  async myPosts(userId: number) {
    const posts = await this.prismaService.post.findMany({
      include: {
        contents: true,
        comments: true
      },
      where: {
        author_id: userId,
      },
    });
    if (posts.length === 0)
      throw new NotFoundException('You have not posted yet');
    return posts;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }

  async removePost(userId: number, id: number) {
    const post = await this.prismaService.post.findFirst({
      include: {
        contents: true,
        tags: true,
      },
      where: {
        id,
        author_id: userId,
      },
    });
    if (!post) throw new NotFoundException('Post not found');

    try {
      Promise.all([
        post.contents.forEach(async (content) => {
          await this.prismaService.content.delete({
            where: {
              id: content.id,
            },
          });
          fs.unlinkSync(path.resolve(__dirname, '..', 'posts', content.url));
        }),
        post.tags.forEach(async (tag) => {
          await this.prismaService.tag.delete({
            where: {
              id: tag.id,
            },
          });
        }),
      ]);
      await this.prismaService.post.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new BadRequestException("Pending...")
    }
    
    return { status: 'Ok', message: 'Successfully deleted' };
  }

  async globalSearch(tag: string) {
    const tags = await this.prismaService.tag.findMany({
      where: {
        name: {
          contains: tag
        }
      }
    });
    if (tags.length === 0) throw new BadRequestException("No result");
    const posts = [];
    tags.forEach(async (tag) => {
      const post = await this.prismaService.post.findFirst({
        where: {
          id: tag.post_id
        }
      });
      if (post) {
        posts.push(post);
      }
    });
    if (posts.length === 0) throw new NotFoundException("No result");
    return posts;
  }
}
