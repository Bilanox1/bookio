import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  public async sendEmail(mailData: {
    to: string;
    subject: string;
    text?: string;
    html?: string;
  }): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: mailData.to,
        from: 'bbilalzaimrajawi@gmail.com',
        subject: mailData.subject,
        text: mailData.text,
        html: mailData.html,
      });
      console.log('Email sent successfully!');
    } catch (error) {
      console.error('Error while sending email:', error.message);
      throw new RequestTimeoutException('Failed to send email');
    }
  }
}
