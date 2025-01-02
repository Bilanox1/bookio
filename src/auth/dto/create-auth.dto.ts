// src/auth/dto/create-auth.dto.ts
import { IsString, IsEmail } from 'class-validator';

export class CreateAuthDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

}
