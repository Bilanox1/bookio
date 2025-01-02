import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UploadsController } from './uploads.controller';
import { MulterModule } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';
import multer from 'multer';

@Module({
  imports: [MulterModule.register()],
  controllers: [UploadsController],
  providers: [UploadsService],
  exports:[UploadsService]
})
export class UploadsModule {}
