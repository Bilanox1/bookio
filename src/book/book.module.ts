import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { Book, BookSchema } from './schema/book.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UploadsService } from 'src/uploads/uploads.service';
import { BookService } from './book.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
  ],
  controllers: [BookController],
  providers: [BookService, UploadsService],
  exports: [BookService],
})
export class BookModule {}
