import { PrismaService } from './../prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async findAll() {
    const allUsers = await this.prismaService.user.findMany({});

    if (allUsers.length === 0) {
      throw new NotFoundException('Users not found :(');
    }
    return allUsers;
  }

  async findById(id: number) {
    const user = await this.prismaService.user.findFirst({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found :(');
    }
    return user;
  }

  async findByUsername(username: string) {
    const users = await this.prismaService.user.findMany({
      where: {
        username: {
          contains: username,
        },
      },
    });

    if (users.length === 0) {
      throw new NotFoundException('Users not found :(');
    }
    return users;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prismaService.user.findFirst({
      where: {
        id
      }
    });
    if ( !user ) throw new NotFoundException("User not found");

    const updatedUser = await this.prismaService.user.update({
      data: {
        ...updateUserDto
      },
      where: {
        id
      }, select: {
        first_name: true,
        last_name: true,
        username: true,
        is_active: true,
        is_admin: false
      }
    });
    return updatedUser;
  }

  async remove(id: number) {
    const user = await this.prismaService.user.findFirst({
      where: {
        id
      }
    });
    if ( !user ) throw new NotFoundException("User not found");

    await this.prismaService.user.delete({
      where: { id }
    });
    return { message: "Successfully deleted", status: 'Ok' };
  }
}
