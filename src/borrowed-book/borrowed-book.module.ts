import { Module } from '@nestjs/common';
import { BorrowedBookController } from './borrowed-book.controller';
import { BorrowedBookService } from './borrowed-book.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BorrowedBook,
  BorrowedBookSchema,
} from './schemas/borrowed-book.schema';
import { BookModule } from 'src/book/book.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BorrowedBook.name, schema: BorrowedBookSchema },
    ]),
    BookModule,
  ],
  controllers: [BorrowedBookController],
  providers: [BorrowedBookService],
})
export class BorrowedBookModule {}
