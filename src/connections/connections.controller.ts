import {
  Controller,
  Get,
  Post,
  Body
} from '@nestjs/common';
import { ConnectionsService } from './connections.service';
import { FollowDto } from './dto';
import { GetCurrentUserId } from '../common/decorators/get-current-user-id.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Connections')
@Controller('connect')
export class ConnectionsController {
  constructor(private readonly connectionsService: ConnectionsService) {}

  @ApiOperation({ summary: '| Un ( follow ) ' })
  @Post('un-follow')
  follow(@GetCurrentUserId() id: number, @Body() followDto: FollowDto) {
    return this.connectionsService.follow(id, followDto);
  }

  @ApiOperation({ summary: '| Followers ' })
  @Get('followers')
  followers(@GetCurrentUserId() id: number) {
    return this.connectionsService.myFollowers(id);
  }

  @ApiOperation({ summary: '| Following ' })
  @Get('following')
  following(@GetCurrentUserId() id: number) {
    return this.connectionsService.myFollowings(id);
  }
}
