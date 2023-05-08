import { UserModule } from './user/user.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseService } from './firebase/firebase.service';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    UserModule, ConfigModule.forRoot(),
    EmailModule
  ],
  controllers: [AppController],
  providers: [AppService, FirebaseService],
})
export class AppModule { }