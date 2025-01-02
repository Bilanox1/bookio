import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createAuthDto: CreateAuthDto) {
    try {
      const user = await this.authService.register(createAuthDto);
      return { message: 'User created successfully', data: user };
    } catch (error) {
      throw new HttpException(
        { statusCode: HttpStatus.BAD_REQUEST, message: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('login')
  async login(@Body() createAuthDto: any) {
    try {
      const loginResponse = await this.authService.login(createAuthDto);
      return loginResponse;
    } catch (error) {
      throw new HttpException(
        { statusCode: HttpStatus.UNAUTHORIZED, message: error.message },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @Post('logout')
  async logout(@Body() { accessToken }: { accessToken: string }) {
    try {
      const logoutResponse = await this.authService.logout(accessToken);
      return logoutResponse;
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('user')
  async getUser(@Body() { accessToken }: { accessToken: string }) {
    try {
      const user = await this.authService.getUser(accessToken);
      return user;
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
