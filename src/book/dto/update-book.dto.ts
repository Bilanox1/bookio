import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class UpdateBookDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  author?: string;

  @IsString()
  @IsOptional()
  coverUrl?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsNumber()
  @IsOptional()
  rating?: number;

  @IsNumber()
  @IsOptional()
  totalRatings?: number;

  @IsString()
  @IsOptional()
  price?: string;

  @IsString()
  @IsOptional()
  rentalPrice?: string;

  @IsString()
  @IsOptional()
  summary?: string;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @IsDateString()
  @IsOptional()
  releaseDate?: string;

  @IsNumber()
  @IsOptional()
  pages?: number;

  @IsString()
  @IsOptional()
  language?: string;

  @IsString()
  @IsOptional()
  isbn?: string;

  @IsBoolean()
  @IsOptional()
  isNews?: boolean;

  @IsBoolean()
  @IsOptional()
  isBestseller?: boolean;
}
