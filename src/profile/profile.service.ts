import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FilesService } from '../files/files.service';

@Injectable()
export class ProfileService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly fileService: FilesService,
  ) {}

  async setProfilePhoto(id: number, image: any) {
    const fileName = await this.fileService.createFile(image, "profile");
    const profile = await this.prismaService.profile.create({
      data: {
        user_id: id,
        url: fileName,
      },
    });
    return profile;
  }

  async seeProfile(id: number) {
    const user = await this.prismaService.user.findFirst({
      where: {
        id,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const profile = await this.prismaService.profile.findMany({
      where: {
        user_id: id,
      },
    });
    if ( profile.length === 0 ) throw new HttpException("Profile is empty", HttpStatus.OK);
    const links = profile.map((profile) => "localhost:3000/" + profile.url)
    return links;
  }
}
