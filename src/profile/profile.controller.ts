import {
  Controller,
  Post,
  Get,
  Param,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetCurrentUserId } from '../common/decorators/get-current-user-id.decorator';

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiOperation({ summary: '| Set profile photo' })
  @Post('set')
  @UseInterceptors(FileInterceptor('image'))
  setProfilePhoto(@GetCurrentUserId() id: number, @UploadedFile() image: any) {
    return this.profileService.setProfilePhoto(id, image);
  }

  @ApiOperation({ summary: '| Set profile photo' })
  @Get('see/:id')
  seeProfile(@Param("id") id: string) {
    return this.profileService.seeProfile(+id);
  }
}
