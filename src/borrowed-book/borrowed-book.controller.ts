import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { BorrowedBookService } from './borrowed-book.service';
import { CreateBorrowedBookDto } from './dto/CreateBorrowedBookDto';
import { BorrowedBook } from './schemas/borrowed-book.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Book, BookDocument } from 'src/book/schema/book.schema';
import { Model } from 'mongoose';
import { AuthGuard } from 'src/guards/auth/auth.guard';

@Controller('borrowed-books')
export class BorrowedBookController {
  constructor(private readonly borrowedBookService: BorrowedBookService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body() createBorrowedBookDto: any,
    @Request() req: any,
  ): Promise<BorrowedBook> {
    console.log(req.user);

    const data: any = {
      user: {
        _id: req.user['cognito:username'],
        name: req.user.name,
        email: req.user.email,
      },
      books: createBorrowedBookDto.books,
      totale: createBorrowedBookDto.totale,
    };

    console.log(data);

    const createdBorrowedBook = this.borrowedBookService.create(data);

    return createdBorrowedBook;
  }
  @Get()
  async findAll(): Promise<BorrowedBook[]> {
    return this.borrowedBookService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<BorrowedBook> {
    return this.borrowedBookService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBorrowedBookDto: any,
  ): Promise<BorrowedBook> {
    return this.borrowedBookService.update(id, updateBorrowedBookDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.borrowedBookService.remove(id);
  }
}
