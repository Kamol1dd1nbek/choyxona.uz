import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

const start = async () => {
  try {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('choy');
    const config = app.get(ConfigService);
    app.useGlobalPipes(new ValidationPipe());

    const swaggerConfig = new DocumentBuilder()
      .setTitle("'Choyxona' social network")
      .setDescription(
        'A new social network for people to chat more comfortably',
      )
      .addTag(
        'NodeJs NestJs Postgresql Prisma JWT OTP Email verification Swagger',
      )
      .setVersion('1.0.0')
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('choy/docs', app, document);

    app.use(cookieParser);
    const PORT = config.get<number>('PORT');
    await app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
