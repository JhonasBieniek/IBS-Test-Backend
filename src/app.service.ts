import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()

export class AppService {
  constructor(private readonly mailerService: MailerService) { }
  sendMail(email: string, title: string, text: string):void {
    this.mailerService.sendMail({
      to: email,
      from: 'goniekltda@gmail.com',
      subject: title,
      html: text,
    })
  }
}