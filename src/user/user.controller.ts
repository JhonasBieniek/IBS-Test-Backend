import { Body, Controller, Get, Param, Delete, Patch, Post } from '@nestjs/common';
import { User } from 'src/models/user.model';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('register')
  public register(@Body() body: Omit<User, 'id'>) {
    return this.userService.register(body);
  }

  @Get()
  async getData(): Promise<Object> {
    return this.userService.getAll();
  }

  @Get('single/:id')
  async getOneData(@Param('id') id: string): Promise<Object> {
    return this.userService.getOne(id);
  }

  @Patch('edit/:id')
  update(@Param('id') id: string, @Body() user: User) {
    return this.userService.update(id, user);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.userService.remove(id);
  }
}
