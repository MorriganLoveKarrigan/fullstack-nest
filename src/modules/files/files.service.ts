import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';
import * as sharp from 'sharp';


@Injectable()
export class FilesService {
  async createFile(file: any): Promise<string> {
    try {
      const fileName = `${uuid.v4()}.jpg`;
      const filePath = path.resolve(__dirname, '..', 'static');
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }
      const compressedImage = await sharp(file.buffer).webp({ quality: 75 }).toBuffer();
      fs.writeFileSync(path.join(filePath, fileName), compressedImage);
      return fileName;
    } catch (e) {
      console.log(e);
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteFile(fileName: string): Promise<void> {
    try {
      const filePath = path.resolve(__dirname, '..', 'static', fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (e) {
      throw new HttpException('Failed to delete file', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
