import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  UploadedFile,
  ParseIntPipe,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { UploadsService } from 'src/uploads/uploads.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { TransformDataInterceptor } from 'src/interceptors/transform-data.interceptor';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { AdminGuard } from 'src/guards/auth/admin.guard';
// import { AuthGuard } from '../auth/auth.guard'; // Exemple d'authentification

@Controller('api/books')
export class BookController {
  constructor(
    private readonly bookService: BookService,
    private readonly uploadsService: UploadsService,
  ) {}

  // Lister tous les livres
  @Get()

  findAll() {
    return this.bookService.findAll();
  }

  @Get('/all')
  findAllWithSelect() {
    return this.bookService.findAllWithSelect();
  }

  // Détails d’un livre
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookService.findOne(id);
  }

  // Ajouter un nouveau livre (admin uniquement)
  // @UseGuards(AuthGuard) // Exemple : seulement pour les administrateurs
  @Post()
  @UseInterceptors(TransformDataInterceptor)
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter(req, file, cb) {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Only image files are allowed!'), false);
        }
      },
      limits: {
        fileSize: 2 * 1024 * 1024, // 2MB
      },
    }),
  )
  async create(
    @Body() createBookDto: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log('file');

    console.log(createBookDto.file);

    console.log('file');

    const folder = 'book-images';
    const { url, key } = await this.uploadsService.uploadFileToS3(file, folder);
    console.log(url, key);

    createBookDto.coverImage = { url, key };

    return this.bookService.create(createBookDto);
  }

  // Mettre à jour un livre (admin uniquement)
  // @UseGuards(AuthGuard) // Exemple : seulement pour les administrateurs
  @Put(':id')
  update(@Param('id') id: string, @Body() updateBookDto: any) {
    console.log(updateBookDto);

    return this.bookService.update(id, updateBookDto);
  }

  // Supprimer un livre (admin uniquement)
  // @UseGuards(AuthGuard) // Exemple : seulement pour les administrateurs
  @Delete(':id')
  async remove(@Param('id') id: string, @Body() body: { key: string }) {
    const { key } = body;

    try {
      await this.uploadsService.deleteFileFromS3(key);

      await this.bookService.remove(id);

      return {
        message: `The book has been successfully deleted!`,
      };
    } catch (error) {
      return {
        message: 'Error while deleting the book.',
        error: error.message,
      };
    }
  }

  // Emprunter un livre (utilisateur authentifié)
  // @UseGuards(AuthGuard) // Exemple : seulement pour les utilisateurs authentifiés
  @Post(':id/borrow')
  borrowBook(@Param('id') id: string) {
    return this.bookService.borrowBook(id);
  }

  // Retourner un livre (utilisateur authentifié)
  // @UseGuards(AuthGuard) // Exemple : seulement pour les utilisateurs authentifiés
  @Post(':id/return')
  returnBook(@Param('id') id: string) {
    return this.bookService.returnBook(id);
  }
}
