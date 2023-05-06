import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { FirebaseService } from './firebase/firebase.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        auth: {
          user: 'goniekinbox@gmail.com',
          pass: 'ewoxgmbjlpvizwnp',
        }
      }
    }),
    AuthModule, ConfigModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService, FirebaseService],
})
export class AppModule { }