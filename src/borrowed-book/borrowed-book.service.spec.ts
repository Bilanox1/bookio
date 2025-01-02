import { Test, TestingModule } from '@nestjs/testing';
import { BorrowedBookService } from './borrowed-book.service';
import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { BookService } from '../book/book.service';

describe('BorrowedBookService', () => {
  let service: BorrowedBookService;
  let bookServiceMock: Partial<BookService>;
  let borrowedBookModelMock: any;

  beforeEach(async () => {
    bookServiceMock = {
      isBookAvailable: jest.fn(),
      availableQuantity: jest.fn(),
      updateAvailableQuantityDecremente: jest.fn(),
      updateAvailableQuantityIncremente: jest.fn(),
    };

    borrowedBookModelMock = {
      create: jest.fn().mockImplementation((dto) => ({
        ...dto,
        save: jest.fn().mockResolvedValue({ id: '123', ...dto }),
      })),
      find: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([{ id: '1', books: [] }]),
      }),
      findById: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue({ id: '123', books: [] }),
      }),
      findByIdAndUpdate: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue({ id: '123', books: [] }),
      }),
      findByIdAndDelete: jest.fn().mockReturnValue({
        exec: jest.fn(),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BorrowedBookService,
        { provide: BookService, useValue: bookServiceMock },
        {
          provide: getModelToken('BorrowedBook'),
          useValue: borrowedBookModelMock,
        },
      ],
    }).compile();

    service = module.get<BorrowedBookService>(BorrowedBookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // describe('create', () => {
  //   it('should throw BadRequestException if any book is unavailable', async () => {
  //     bookServiceMock.isBookAvailable = jest.fn().mockResolvedValue(false);

  //     await expect(
  //       service.create({
  //         books: [{ bookId: '1', quantity: 2 }],
  //       }),
  //     ).rejects.toThrow(BadRequestException);

  //     expect(bookServiceMock.isBookAvailable).toHaveBeenCalledWith('1', 2);
  //   });

  //   it('should call necessary services and save a new borrowed book', async () => {
  //     bookServiceMock.isBookAvailable = jest.fn().mockResolvedValue(true);
  //     bookServiceMock.updateAvailableQuantityDecremente = jest.fn();

  //     const result = await service.create({
  //       books: [{ bookId: '1', quantity: 2 }],
  //     });

  //     expect(bookServiceMock.isBookAvailable).toHaveBeenCalledWith('1', 2);
  //     expect(
  //       bookServiceMock.updateAvailableQuantityDecremente,
  //     ).toHaveBeenCalledWith('1', 2);
  //     expect(result).toEqual({
  //       id: '123',
  //       books: [{ bookId: '1', quantity: 2 }],
  //     });
  //   });
  // });

  describe('findAll', () => {
    it('should return all borrowed books', async () => {
      const result = await service.findAll();
      expect(result).toEqual([{ id: '1', books: [] }]);
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if book is not found', async () => {
      borrowedBookModelMock.findById().exec = jest.fn().mockResolvedValue(null);

      await expect(service.findOne('123')).rejects.toThrow(NotFoundException);
    });

    it('should return the borrowed book if found', async () => {
      const result = await service.findOne('123');
      expect(result).toEqual({ id: '123', books: [] });
    });
  });

  describe('update', () => {
    it('should throw NotFoundException if book to update is not found', async () => {
      borrowedBookModelMock.findByIdAndUpdate().exec = jest
        .fn()
        .mockResolvedValue(null);

      await expect(service.update('123', {})).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should update and return the borrowed book', async () => {
      const result = await service.update('123', { books: [] });
      expect(result).toEqual({ id: '123', books: [] });
    });
  });

  describe('remove', () => {
    it('should throw NotFoundException if book to delete is not found', async () => {
      borrowedBookModelMock.findById().exec = jest.fn().mockResolvedValue(null);

      await expect(service.remove('123')).rejects.toThrow(NotFoundException);
    });

    it('should delete the book and call necessary services', async () => {
      borrowedBookModelMock.findById().exec = jest.fn().mockResolvedValue({
        books: [{ bookId: '1', quantity: 2 }],
      });

      await service.remove('123');

      expect(
        bookServiceMock.updateAvailableQuantityIncremente,
      ).toHaveBeenCalledWith('1', 2);
      expect(borrowedBookModelMock.findByIdAndDelete).toHaveBeenCalledWith(
        '123',
      );
    });
  });
});
