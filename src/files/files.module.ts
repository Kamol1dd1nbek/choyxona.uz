import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { winstonModule } from '../winston/winston.module';
import { WinstonModule } from 'nest-winston';
import { LoggerService } from '../winston/winston.service';

@Module({
  providers: [FilesService],
  exports: [FilesService]
})
export class FilesModule {}
