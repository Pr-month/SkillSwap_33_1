import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';
import { ApiUploadFile } from './files.swagger';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  @Post('upload')
  @ApiUploadFile()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/uploads',
        filename: (req, file, callback) => {
          const uniqueName = uuid() + extname(file.originalname);
          callback(null, uniqueName);
        },
      }),
      limits: {
        fileSize: 2 * 1024 * 1024, // 2 МБ
      },
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/^image\/(jpeg|png|gif|webp)$/)) {
          callback(new Error('Only image files are allowed'), false);
        }
        callback(null, true);
      },
    }),
  )
  uploadFile(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return {
      url: `/uploads/${file.filename}`,
    };
  }
}
