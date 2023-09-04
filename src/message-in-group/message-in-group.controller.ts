import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MessageInGroupService } from './message-in-group.service';
import { CreateMessageInGroupDto } from './dto/create-message-in-group.dto';
import { GetCurrentUserId } from '../common/decorators/get-current-user-id.decorator';

@Controller('message-in-group')
export class MessageInGroupController {
  constructor(private readonly messageInGroupService: MessageInGroupService) {}

  @Post(":id")
  write(
    @GetCurrentUserId() user_id: number,
    @Param("id") group_id: string,
    @Body() createMessageInGroupDto: CreateMessageInGroupDto) {
    return this.messageInGroupService.write(user_id, +group_id, createMessageInGroupDto);
  }
}
