import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BookDocument = Book & Document;

class CoverImage {
  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  key: string;
}

@Schema({ timestamps: true })
export class Book {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  author: string;

  @Prop()
  category: string;

  @Prop({ required: true })
  isbn: string;

  @Prop({ required: true, default: 1 })
  quantity: number;

  @Prop({ required: true, default: 0 })
  availableQuantity: number;

  @Prop({ type: CoverImage, required: true })
  coverImage: CoverImage;

  @Prop({ required: true })
  rating: string;

  @Prop({ required: true })
  totalRatings: string;

  @Prop({ required: true })
  price: string;

  @Prop()
  rentalPrice?: string;

  @Prop()
  summary?: string;

  @Prop({ default: true })
  isAvailable: boolean;

  @Prop({ required: true })
  releaseDate: string;

  @Prop()
  pages?: string;

  @Prop()
  language?: string;

  @Prop()
  isNew?: boolean;

  @Prop()
  isBestseller?: boolean;

  @Prop({ default: 'available' })
  status: string;
}

export const BookSchema = SchemaFactory.createForClass(Book);
