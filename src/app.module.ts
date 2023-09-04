import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';
import { MailModule } from './mail/mail.module';
import { ConnectionsModule } from './connections/connections.module';
import { ProfileModule } from './profile/profile.module';
import { FilesModule } from './files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path';
import { ChatModule } from './chat/chat.module';
import { MessageModule } from './message/message.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { PostLikeModule } from './post-like/post-like.module';
import { GroupModule } from './group/group.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({ rootPath: resolve(__dirname, "profiles") }),
    UserModule,
    AuthModule,
    RedisModule,
    MailModule,
    ConnectionsModule,
    ProfileModule,
    FilesModule,
    ChatModule,
    MessageModule,
    PostModule,
    CommentModule,
    PostLikeModule,
    GroupModule,
  ],
  providers: [AppService],
})
export class AppModule {}
