import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { GetCurrentUserId } from '../common/decorators/get-current-user-id.decorator';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  create(
    @GetCurrentUserId() user_id: number,
    @Body() createGroupDto: CreateGroupDto,
  ) {
    return this.groupService.createGroup(user_id, createGroupDto);
  }

  @Get()
  findAll(@GetCurrentUserId() user_id: number) {
    return this.groupService.myGroups(user_id);
  }

  @Get(':name')
  findOne(@Param('name') name: string) {
    return this.groupService.findOne(name);
  }

  @Post(":id")
  joinGroup(
    @GetCurrentUserId() user_id: number,
    @Param("id") id: string
  ) {
    return this.groupService.joinGroup(user_id, +id);
  }
}
