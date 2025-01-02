// src/uploads/uploads.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';
import { Express } from 'express';

@Controller('api/uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter(req, file, cb) {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Only image files are allowed!'), false);
        }
      },
      limits: {
        fileSize: 2 * 1024 * 1024, 
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    const folder = body.folder || 'uploads'; 

    try {

      const { url, key } = await this.uploadsService.uploadFileToS3(
        file,
        folder,
      );

      return {
        message: 'File uploaded successfully',
        url,
        key,
      };
    } catch (error) {
      throw new BadRequestException('Failed to upload file');
    }
  }
}
