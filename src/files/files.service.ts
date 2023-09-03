import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as uuid from 'uuid';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class FilesService {
  async createFile(file: any, type: 'post' | 'profile') {
    try {
      let fileName;
      let filePath;
      if (type == 'post') {
        fileName = uuid.v4() + '.jpg';
        filePath = path.resolve(__dirname, '..', 'posts');
      } else {
        fileName = uuid.v4() + '.jpg';
        filePath = path.resolve(__dirname, '..', 'profiles');
      }

      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }
      fs.writeFileSync(path.join(filePath, fileName), file.buffer);
      return fileName;
    } catch (error) {
      throw new HttpException(
        'Error writing file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
