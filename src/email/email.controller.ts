import { EmailService } from './email.service';
import { Controller, Post, Body } from '@nestjs/common';

@Controller('email')
export class EmailController {
  constructor(
    private readonly emailService: EmailService
  ) { }

  @Post('send-email')
  sendEmail(
    @Body('email') email: string,
    @Body('text') text: string,
    @Body('title') title: string): void {
    this.emailService.sendMail(email, title, text);
  }
}
