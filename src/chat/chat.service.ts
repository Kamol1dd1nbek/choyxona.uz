import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prismaService: PrismaService) {}

  async createChat(createChatDto: CreateChatDto) {
    const { first_id, second_id } = createChatDto;
    const conflict = await this.prismaService.chat.findFirst({
      where: {
        OR: [
          {
            first_id,
            second_id,
          },
          {
            first_id: second_id,
            second_id: first_id,
          },
        ],
      },
    });
    if (conflict) {
      return { chatId: conflict.id };
    }
    const first_user = await this.prismaService.user.findFirst({
      where: { id: first_id },
    });
    const second_user = await this.prismaService.user.findFirst({
      where: { id: second_id },
    });
    if (!first_user || !second_user)
      throw new BadRequestException('Both users must be registered');

    const newChat = await this.prismaService.chat.create({
      data: {
        first_id,
        second_id,
      },
    });
    return { chatId: newChat.id };
  }

  async findAll() {
    const allChats = await this.prismaService.chat.findMany({});
    if (allChats.length === 0) throw new NotFoundException('Chats not found');
    return allChats;
  }

  async remove(user_id: number, chat_id: number) {
    const chat = await this.prismaService.chat.findFirst({
      where: {
        id: chat_id,
        first_id: user_id,
      },
    });
    const chat2 = await this.prismaService.chat.findFirst({
      where: {
        id: chat_id,
        second_id: user_id,
      },
    });
    console.log(chat, chat2);
    if (!chat && !chat2) {
      throw new BadRequestException('Access denied');
    }

    await this.prismaService.chat.delete({
      where: {
        id: chat_id,
      },
    });
    return { status: 'Ok', message: 'Chat successfully deleted' };
  }

  async myChats(id: number) {
    const chats = await this.prismaService.chat.findMany({
      where: {
        OR: [
          {
            first_id: id,
          },
          {
            second_id: id,
          },
        ],
      },
    });
    if (chats.length === 0) {
      throw new NotFoundException('Chats are not available');
    }
    return chats;
  }
}
