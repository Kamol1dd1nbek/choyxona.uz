import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMessageInGroupDto } from './dto/create-message-in-group.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessageInGroupService {
  constructor(private readonly prismaService: PrismaService) {}

  async write(userId: number, group_id: number, createMessageInGroupDto: CreateMessageInGroupDto) {
    const { text } = createMessageInGroupDto;
    const group = await this.prismaService.group.findFirst({
      where: {
        id: group_id,
      },
    });
    if (!group) {
      throw new BadRequestException('Group not found');
    }
    const isJoined = await this.prismaService.userInGroup.findFirst({
      where: {
        user_id: userId,
        group_id
      }
    });

    if ( !isJoined || group.admin_id !== userId ) throw new BadRequestException("You are not a member of the group");
    const newMessage = await this.prismaService.messageInGroup.create({
      data: {
        user_id: userId,
        group_id,
        body: text
      },
    });
    return newMessage;
  }
}