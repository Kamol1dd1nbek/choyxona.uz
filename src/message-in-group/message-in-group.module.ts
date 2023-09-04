import { Module } from '@nestjs/common';
import { MessageInGroupService } from './message-in-group.service';
import { MessageInGroupController } from './message-in-group.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MessageInGroupController],
  providers: [MessageInGroupService],
})
export class MessageInGroupModule {}
