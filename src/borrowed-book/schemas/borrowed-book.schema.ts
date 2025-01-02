import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BorrowedBookDocument = BorrowedBook & Document;

enum BorrowedBookStatus {
  PENDING = 'pending',
  RETURNED = 'returned',
  OVERDUE = 'overdue',
}

@Schema({ timestamps: true })
export class BorrowedBook {
  @Prop({
    type: {
      _id: { type: String, required: true },
      name: { type: String, required: true },
      email: { type: String, required: true },
    },
    required: true,
  })
  user: {
    _id: string;
    name: string;
    email: string;
  };
  @Prop({
    type: [
      {
        bookId: { type: Types.ObjectId, ref: 'Book', required: true },
        author: { type: String, required: true },
        title: { type: String, required: true },
        quantity: { type: Number, required: true },
        coverImage: { type: String, required: true },
        price: { type: Number, required: true },
        borrowedAt: { type: Date, required: true },
        returnDueDate: { type: Date, required: true },
        status: {
          type: String,
          enum: BorrowedBookStatus,
          default: BorrowedBookStatus.PENDING,
        },
      },
    ],
    required: true,
  })
  books: Array<{
    bookId: Types.ObjectId;
    title: string;
    author: string;
    quantity: number;
    coverImage: string;
    price: number;
    borrowedAt: Date;
    returnDueDate: Date;
    status: BorrowedBookStatus;
  }>;

  @Prop({ required: true })
  totale: number;
}

export const BorrowedBookSchema = SchemaFactory.createForClass(BorrowedBook);
