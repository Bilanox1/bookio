import { Test, TestingModule } from '@nestjs/testing';
import { BorrowedBookController } from './borrowed-book.controller';

describe('BorrowedBookController', () => {
  let controller: BorrowedBookController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BorrowedBookController],
    }).compile();

    controller = module.get<BorrowedBookController>(BorrowedBookController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
