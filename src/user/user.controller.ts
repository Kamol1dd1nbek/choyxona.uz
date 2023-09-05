import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../common/guards/admin.guard';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AdminGuard)
  @ApiOperation({ summary: '| Get all users list' })
  @Get('list')
  findAllUsers() {
    return this.userService.findAll();
  }

  @ApiOperation({ summary: '| Find user by id' })
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.userService.findById(+id);
  }

  @ApiOperation({ summary: '| Find user by username' })
  @Get('u/:username')
  findByUsername(@Param('username') username: string) {
    return this.userService.findByUsername(username);
  }

  @ApiOperation({ summary: '| Update user' })
  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @ApiOperation({ summary: '| Delete user' })
  @Delete(':id')
  removeUser(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
