import { PrismaService } from './../prisma/prisma.service';
import { Injectable, BadRequestException, Body } from '@nestjs/common';
import { CreateMessageDto, RemoveMessageDto, UpdateMessageDto } from './dto';

@Injectable()
export class MessageService {
  constructor(private readonly prismaService: PrismaService) {}

  async write(user_id: number, createMessageDto: CreateMessageDto) {
    const { forward_to, text, chat_id } = createMessageDto;
    const chat = await this.prismaService.chat.findFirst({
      where: {
        id: chat_id,
      },
    });
    if (!chat) {
      throw new BadRequestException('You have no such chat');
    }
    const hasUserInchat = await this.prismaService.chat.findFirst({
      where: {
        OR: [
          {
            first_id: user_id,
          },
          {
            second_id: user_id,
          },
        ],
      },
    });
    if (!hasUserInchat) throw new BadRequestException('You have no such chat');
    const newMessage = await this.prismaService.message.create({
      data: {
        forward_to_id: forward_to,
        body: text,
        user_id,
        chat_id,
      },
    });
    return newMessage;
  }

  async update(user_id: number, updateMessageDto: UpdateMessageDto) {
    const message = await this.prismaService.message.findFirst({
      where: {
        id: updateMessageDto.message_id,
      },
    });
    if (
      !message ||
      message.user_id !== user_id ||
      message.chat_id !== updateMessageDto.chat_id
    )
      throw new BadRequestException('Message not found');
    const updatedMessage = await this.prismaService.message.update({
      data: {
        body: updateMessageDto.text,
      },
      where: {
        id: updateMessageDto.message_id,
        user_id,
      },
    });
    return {
      status: 'Ok',
      message: 'Message successfully updated',
      updated_message: updatedMessage,
    };
  }

  async remove(user_id: number, removeMessageto: RemoveMessageDto) {
    const { chat_id, message_id } = removeMessageto;
    const message = await this.prismaService.message.findFirst({
      where: {
        id: message_id,
      },
    });
    if (!message || message.user_id !== user_id || message.chat_id !== chat_id)
      throw new BadRequestException('Message not found');
    const updatedMessage = await this.prismaService.message.delete({
      where: {
        id: removeMessageto.message_id,
        user_id,
      },
    });
    return { status: 'Ok', message: 'Message successfully removed' };
  }
}
