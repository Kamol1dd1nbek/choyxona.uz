import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { LoggerService } from './winston.service';
import * as winston from 'winston';

@Module({
  imports: [
    WinstonModule.forRoot({
      // options
    }),
  ],
  providers: [LoggerService],
})
export class winstonModule {} 