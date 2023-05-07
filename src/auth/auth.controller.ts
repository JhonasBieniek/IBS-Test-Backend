import { Body, Controller, Post, Get, Param, Delete, Patch } from '@nestjs/common';
import { User } from 'src/models/user.model';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  public login(@Body() body: Pick<User, 'email' | 'password'>) {
    return this.authService.login(body.email, body.password);
  }

  @Post('register')
  public register(@Body() body: Omit<User, 'id'>) {
    return this.authService.register(body);
  }

  @Get()
  async getData(): Promise<any> {
    return this.authService.getAll();
  }

  @Get('single/:id')
  async getOneData(@Param('id') id: string): Promise<any> {
    return this.authService.getOne(id);
  }

  @Patch('edit/:id')
  update(@Param('id') id: string, @Body() user: User) {
    return this.authService.update(id, user);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string): Promise<any> {
    return this.authService.remove(id);
  }
}
