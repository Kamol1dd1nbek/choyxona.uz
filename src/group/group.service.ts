import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GroupService {
  constructor(private readonly prismaService: PrismaService) {}

  async createGroup(user_id: number, createGroupDto: CreateGroupDto) {
    const { name } = createGroupDto;
    const conflict = await this.prismaService.group.findFirst({
      where: {
        name,
      },
    });
    if (conflict) throw new BadRequestException('There is a group called this');
    const newGroup = await this.prismaService.group.create({
      data: {
        admin_id: user_id,
        name,
      },
    });
    return { group_id: newGroup.id, name: newGroup.name };
  }

  async myGroups(user_id: number) {
    const groups = await this.prismaService.group.findMany({
      include: {
        users: true,
        messages: true,
      },
      where: {
        admin_id: user_id,
      },
    });
    if (groups.length === 0)
      throw new NotFoundException('Your groups do not exist');
    return groups;
  }

  async findOne(name: string) {
    const groups = await this.prismaService.group.findMany({
      where: {
        name: {
          contains: name,
        },
      },
    });
    if (groups.length === 0) throw new NotFoundException('Groups not found');
    return groups;
  }

  async joinGroup(user_id: number, group_id: number) {
    const group = await this.prismaService.group.findFirst({
      include: {
        users: true,
      },
      where: {
        id: group_id,
      },
    });
    if (!group) throw new NotFoundException('Group not found');
    const isJoin = await this.prismaService.userInGroup.findFirst({
      where: {
        user_id,
        group_id,
      },
    });
    if (group.admin_id == user_id)
      throw new BadRequestException('You are admin in this group');
    if (isJoin)
      throw new BadRequestException('You are already a member of the group');
    if (!isJoin) {
      await this.prismaService.userInGroup.create({
        data: {
          user_id,
          group_id,
        },
      });
      return { message: 'You have joined this group' };
    }
  }
}
