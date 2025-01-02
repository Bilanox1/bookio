import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  BorrowedBook,
  BorrowedBookDocument,
} from './schemas/borrowed-book.schema';
import { CreateBorrowedBookDto } from './dto/CreateBorrowedBookDto';
// import { UpdateBorrowedBookDto } from './dto/UpdateBorrowedBookDto';
import { BookService } from 'src/book/book.service';

@Injectable()
export class BorrowedBookService {
  constructor(
    @InjectModel(BorrowedBook.name)
    private readonly borrowedBookModel: Model<BorrowedBookDocument>,
    private readonly bookService: BookService,
  ) {}

  async create(createBorrowedBookDto: any): Promise<BorrowedBook> {
    const { books } = createBorrowedBookDto;

    console.log(books);

    for (const book of books) {
      const isAvailable = await this.bookService.isBookAvailable(
        book.bookId,
        book.quantity,
      );

      if (!isAvailable) {
        throw new BadRequestException(
          `Book with ID ${book.bookId} is not available in the required quantity.`,
        );
      }
    }

    await Promise.all(
      books.map((book: any) =>
        this.bookService.availableQuantity(book.bookId, book.quantity),
      ),
    );

    await Promise.all(
      books.map((book: any) =>
        this.bookService.updateAvailableQuantityDecremente(
          book.bookId,
          book.quantity,
        ),
      ),
    );

    const createdBorrowedBook = new this.borrowedBookModel(
      createBorrowedBookDto,
    );
    return createdBorrowedBook.save();
  }

  async findAll(): Promise<BorrowedBook[]> {
    return this.borrowedBookModel.find().exec();
  }

  async findOne(id: string): Promise<BorrowedBook> {
    const borrowedBook = await this.borrowedBookModel.findById(id).exec();
    if (!borrowedBook) {
      throw new NotFoundException(`BorrowedBook with ID ${id} not found`);
    }
    return borrowedBook;
  }

  async update(id: string, updateBorrowedBookDto: any): Promise<BorrowedBook> {
    const updatedBook = await this.borrowedBookModel
      .findByIdAndUpdate(id, updateBorrowedBookDto, { new: true })
      .exec();
    if (!updatedBook) {
      throw new NotFoundException(`BorrowedBook with ID ${id} not found`);
    }
    return updatedBook;
  }

  async remove(id: string): Promise<void> {
    const borrowedBook = await this.borrowedBookModel.findById(id).exec();
    if (!borrowedBook) {
      throw new NotFoundException(`BorrowedBook with ID ${id} not found`);
    }

    await Promise.all(
      borrowedBook.books.map((book: any) =>
        this.bookService.updateAvailableQuantityIncremente(
          book.bookId,
          book.quantity,
        ),
      ),
    );

    await this.borrowedBookModel.findByIdAndDelete(id).exec();
  }
}
