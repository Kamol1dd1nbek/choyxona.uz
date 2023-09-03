import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { GetCurrentUserId } from '../common/decorators/get-current-user-id.decorator';
import { RemoveMessageDto } from './dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags("Messages")
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('write')
  writeMessage(
    @GetCurrentUserId() user_id: number,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    return this.messageService.write(user_id, createMessageDto);
  }

  @Patch()
  update(
    @GetCurrentUserId() user_id: number,
    @Body() updateMessageDto: UpdateMessageDto,
  ) {
    return this.messageService.update(user_id, updateMessageDto);
  }

  @Delete(':id')
  remove(
    @GetCurrentUserId() user_id: number,
    @Body() removeMessageDto: RemoveMessageDto,
  ) {
    return this.messageService.remove(user_id, removeMessageDto);
  }
}
