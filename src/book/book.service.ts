import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, BookDocument } from './schema/book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name) private readonly bookModel: Model<BookDocument>,
  ) {}

  // Lister tous les livres
  async findAll(): Promise<Book[]> {
    return this.bookModel.find().exec();
  }

  async findAllWithSelect(): Promise<Book[]> {
    return this.bookModel.find().exec();
  }

  // Détails d’un livre
  async findOne(id: string): Promise<Book> {
    const book = await this.bookModel.findById(id).exec();
    if (!book) {
      throw new NotFoundException(`Livre avec ID ${id} introuvable`);
    }
    return book;
  }

  // Ajouter un nouveau livre
  async create(createBookDto: CreateBookDto): Promise<Book> {
    const newBook = new this.bookModel(createBookDto);
    return newBook.save();
  }

  // Mettre à jour un livre
  async update(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    const updatedBook = await this.bookModel
      .findByIdAndUpdate(id, updateBookDto, { new: true })
      .exec();
    if (!updatedBook) {
      throw new NotFoundException(`Livre avec ID ${id} introuvable`);
    }
    return updatedBook;
  }

  // Supprimer un livre
  async remove(id: string): Promise<void> {
    const result = await this.bookModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Livre avec ID ${id} introuvable`);
    }
  }

  // Emprunter un livre
  async borrowBook(id: string): Promise<Book> {
    const book = await this.bookModel.findById(id).exec();

    return book.save();
  }

  // Retourner un livre
  async returnBook(id: string): Promise<Book> {
    const book = await this.bookModel.findById(id).exec();
    if (!book) {
      throw new NotFoundException(`Livre avec ID ${id} introuvable`);
    }
    return book.save();
  }

  async UpdateAvailableQuantityIncremente(id: string): Promise<boolean> {
    const book = await this.bookModel.findById(id).exec();
    console.log(book);

    if (!book) {
      throw new Error('Book not found');
    }

    if (book.quantity === book.availableQuantity) {
      throw new Error('Quantity is already 0 or insufficient');
    }

    book.availableQuantity += 1;
    await book.save();

    return true;
  }

  async UpdateAvailableQuantityDecriment(id: string): Promise<boolean> {
    const book = await this.bookModel.findById(id).exec();
    if (!book) {
      throw new Error('Book not found');
    }

    if (book.availableQuantity <= 0) {
      throw new Error('Quantity is already 0 or insufficient');
    }

    book.availableQuantity -= 1;
    await book.save();

    return true;
  }

  async isBookAvailable(
    bookId: string,
    requiredQuantity: number,
  ): Promise<boolean> {
    const book = await this.bookModel.findById(bookId).exec();

    console.log(book);

    if (!book) {
      throw new NotFoundException(`Book with ID ${bookId} not found`);
    }
    return book.availableQuantity <= book.quantity;
  }

  async availableQuantity(bookId: string, quantity: number): Promise<Book> {
    const book = await this.bookModel.findById(bookId).exec();
    if (!book) {
      throw new NotFoundException(`Book with ID ${bookId} not found`);
    }

    if (book.availableQuantity + quantity > book.quantity) {
      throw new BadRequestException(
        `Not enough quantity available for book with ID ${bookId}`,
      );
    }
    return book;
  }

  async updateAvailableQuantityDecremente(
    bookId: string,
    quantity: number,
  ): Promise<Book> {
    const book = await this.bookModel.findById(bookId).exec();
    book.availableQuantity += quantity;
    return book.save();
  }

  async updateAvailableQuantityIncremente(
    bookId: string,
    quantity: number,
  ): Promise<Book> {
    const book = await this.bookModel.findById(bookId).exec();
    if (!book) {
      throw new NotFoundException(`Book with ID ${bookId} not found`);
    }

    book.availableQuantity -= quantity;
    return book.save();
  }
}
