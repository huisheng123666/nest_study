import {
  Body,
  Controller,
  HttpException,
  Post,
  UseFilters,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeormFilter } from 'src/filters/typeorm.filter';

@Controller('auth')
@UseFilters(new TypeormFilter())
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signin')
  signin(@Body() dto: any) {
    const { username, password } = dto;
    return this.authService.signin(username, password);
  }

  @Post('/signup')
  signup(@Body() dto: any) {
    const { username, password } = dto;
    if (!username || !password) {
      throw new HttpException('请输入用户名和密码', 400);
    }
    return this.authService.signup(username, password);
  }
}
