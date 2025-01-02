import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from './book/book.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UploadsModule } from './uploads/uploads.module';
import { ConfigModule } from '@nestjs/config';
import { BorrowedBookModule } from './borrowed-book/borrowed-book.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://aurabilanox:bb4aqlmeJEbdAJaT@cluster0.nph0r.mongodb.net/library',
    ),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BookModule,
    UploadsModule,
    BorrowedBookModule,
    AuthModule,
    MailModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
//test

