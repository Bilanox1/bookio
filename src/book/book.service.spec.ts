import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './schema/book.schema';

describe('BookService', () => {
  let service: BookService;
  let bookModel: any;

  beforeEach(async () => {
    const mockBookModel = {
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: getModelToken(Book.name),
          useValue: mockBookModel,
        },
      ],
    }).compile();

    service = module.get<BookService>(BookService);
    bookModel = module.get(getModelToken(Book.name));
  });

  it('should find all books', async () => {
    const mockBooks = [
      { title: 'Book 1', author: 'Author 1' },
      { title: 'Book 2', author: 'Author 2' },
    ];
    bookModel.find.mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockBooks),
    });

    const books = await service.findAll();
    expect(bookModel.find).toHaveBeenCalled();
    expect(books).toEqual(mockBooks);
  });

  it('should find a book by id', async () => {
    const mockBook = { title: 'Book 1', author: 'Author 1' };
    bookModel.findById.mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockBook),
    });

    const book = await service.findOne('1');
    expect(bookModel.findById).toHaveBeenCalledWith('1');
    expect(book).toEqual(mockBook);
  });

  it('should throw NotFoundException if book not found', async () => {
    bookModel.findById.mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });

    await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
  });

  it('should create a new book', async () => {
    const mockBookDto = { title: 'New Book', author: 'Author' };
    const mockSavedBook = { ...mockBookDto, _id: '123' };

    const mockBookModel = {
      save: jest.fn().mockResolvedValue(mockSavedBook),
    };

    // Mocking the create function to return an instance of the mockBookModel
    bookModel.create = jest.fn().mockImplementation(() => mockBookModel);

    const book = await service.create(mockBookDto as any);

    expect(bookModel.create).toHaveBeenCalledWith(mockBookDto);
    expect(mockBookModel.save).toHaveBeenCalled();
    expect(book).toEqual(mockSavedBook);
  });

  it('should update a book', async () => {
    const mockBookDto = { title: 'Updated Book', author: 'Author' };
    const mockUpdatedBook = { ...mockBookDto, _id: '123' };
    bookModel.findByIdAndUpdate.mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockUpdatedBook),
    });

    const book = await service.update('123', mockBookDto as any);
    expect(bookModel.findByIdAndUpdate).toHaveBeenCalledWith(
      '123',
      mockBookDto,
      { new: true },
    );
    expect(book).toEqual(mockUpdatedBook);
  });

  it('should delete a book', async () => {
    bookModel.findByIdAndDelete.mockReturnValue({
      exec: jest.fn().mockResolvedValue({}),
    });

    await expect(service.remove('123')).resolves.toBeUndefined();
    expect(bookModel.findByIdAndDelete).toHaveBeenCalledWith('123');
  });

  it('should throw NotFoundException when deleting a non-existing book', async () => {
    bookModel.findByIdAndDelete.mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });

    await expect(service.remove('123')).rejects.toThrow(NotFoundException);
  });
});
