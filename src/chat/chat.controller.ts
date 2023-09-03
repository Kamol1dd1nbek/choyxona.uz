import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { GetCurrentUserId } from '../common/decorators/get-current-user-id.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Chats')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @ApiOperation({ summary: '| Create new chat' })
  @Post('add')
  create(@Body() createChatDto: CreateChatDto) {
    return this.chatService.createChat(createChatDto);
  }

  @ApiOperation({ summary: 'Get all chats' })
  @Get('all')
  findAll() {
    return this.chatService.findAll();
  }

  @ApiOperation({ summary: '| Remove chat' })
  @Delete(':id')
  remove(@GetCurrentUserId() user_id: number, @Param('id') id: string) {
    return this.chatService.remove(user_id, +id);
  }

  @ApiOperation({ summary: '| My chats' })
  @Post('my')
  myChats(@GetCurrentUserId() user_id: number) {
    return this.chatService.myChats(user_id);
  }

  @ApiOperation({ summary: '| My chats' })
  @Post('my/:id')
  viewChat(@GetCurrentUserId() user_id: number, @Param("id") chat_id: number) {
    return this.chatService.viewChat(user_id, +chat_id);
  }
}
