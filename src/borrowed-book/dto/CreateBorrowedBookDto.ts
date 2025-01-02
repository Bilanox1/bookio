import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateBorrowedBookDto {
  @IsNotEmpty()
  user: {
    id: Types.ObjectId;
    username: string;
  };

  @IsArray()
  books: Array<{
    bookId: Types.ObjectId;
    title: string;
    quantity: number;
    coverImage: string;
    price: number;
    borrowedAt: Date;
    returnDueDate: Date;
  }>;

  @IsNumber()
  totale: number;
}
