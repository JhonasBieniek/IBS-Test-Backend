import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ConfigModule } from '@nestjs/config';
import { FirebaseService } from 'src/firebase/firebase.service';

@Module({
  imports: [ConfigModule],
  controllers: [UserController],
  providers: [UserService, FirebaseService],
})
export class UserModule { }
