import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('send-email')
  sendEmail(
    @Body('email') email: string, 
    @Body('text') text: string, 
    @Body('title') title: string): void
  {
    this.appService.sendMail(email, text, title);
  }
}