import { Injectable } from '@nestjs/common';
import { FollowDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ConnectionsService {
  constructor(private readonly prismaService: PrismaService) {}

  async follow(id: number, followDto: FollowDto) {
    const hasConnection = await this.prismaService.follow.findFirst({
      where: {
        followers_id: followDto.to,
        following_id: id
      }
    });
    if ( hasConnection ) {
      await this.prismaService.follow.delete({ where: { id: hasConnection.id } });
      return { status: "Ok", message: "Unfollowed" };
    }
    await this.prismaService.follow.create({
      data: {
        followers_id: followDto.to,
        following_id: id
      }
    });
    return { status: "Ok", message: "Followed" };
  }

  async myFollowers(id: number) {
    const my_followers = await this.prismaService.follow.findMany({
      where: {
        following_id: id
      },
      select: {
        followers_id: true
      }
    });
    if (my_followers.length === 0) {
      return { followers: 0, message: "No one is following you yet" };
    }
    return {followers: my_followers.length, my_followers};
  }

  async myFollowings(id: number) {
    const followings = await this.prismaService.follow.findMany({
      where: {
        followers_id: id
      }
    });
    if (followings.length === 0) {
      return { followings: 0, message: "You are not following anyone yet" };
    }
    return {following: followings.length, followings};
  }
}
