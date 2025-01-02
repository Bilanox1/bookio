import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send')
  async sendEmail(
    @Body() body: { to: string; subject: string; text?: string; html?: string },
  ) {
    const { to, subject, text, html } = body;

    try {
      await this.mailService.sendEmail({
        to,
        subject,
        text,
        html,
      });

      return { message: 'Email sent successfully!' };
    } catch (error) {
      throw new HttpException(
        { message: 'Failed to send email', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
