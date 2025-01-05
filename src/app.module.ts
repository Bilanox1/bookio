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
    MongooseModule.forRootAsync({
      useFactory: async () => {
        try {
          console.log('Connecting to the database...');
          return {
            uri: 'mongodb+srv://aurabilanox:bb4aqlmeJEbdAJaT@cluster0.nph0r.mongodb.net/library',
            connectionFactory: (connection) => {
              connection.on('connected', () => {
                console.log('✅ Successfully connected to MongoDB');
              });
              connection.on('error', (error) => {
                console.error('❌ Database connection error:', error);
              });
              return connection;
            },
          };
        } catch (error) {
          console.error('❌ Failed to connect to the database:', error);
          throw error;
        }
      },
    }),
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
