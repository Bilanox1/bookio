// src/uploads/uploads.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

@Injectable()
export class UploadsService {
  private s3Client: S3Client;

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
    });
  }
  async uploadFileToS3(
    file: Express.Multer.File,
    folder: string = 'uploads',
  ): Promise<{ url: string; key: string }> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const uploadParams = {
      Bucket: 'upload-image-by-nest', 
      Key: `${folder}/${Date.now()}-${file.originalname}`, 
      Body: file.buffer, 
      ContentType: file.mimetype, 
    };

    try {

      const command = new PutObjectCommand(uploadParams);
      await this.s3Client.send(command);

      const url = `https://${uploadParams.Bucket}.s3.amazonaws.com/${uploadParams.Key}`;
      console.log(url);
      
      return { url, key: uploadParams.Key };
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      throw new BadRequestException('Failed to upload file to S3');
    }
  }

  async deleteFileFromS3(key: string): Promise<void> {
    const deleteParams = {
      Bucket: 'upload-image-by-nest',
      Key: key,
    };

    try {
      const command = new DeleteObjectCommand(deleteParams);
      await this.s3Client.send(command);
    } catch (error) {
      console.error('Error deleting file from S3:', error);
      throw new BadRequestException('Failed to delete file from S3');
    }
  }
}
