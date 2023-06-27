import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeormFilter } from 'src/filters/typeorm.filter';
import { SigninUserDto } from './dto/signin-user.dto';

@Controller('auth')
@UseFilters(new TypeormFilter())
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signin')
  signin(@Body() dto: SigninUserDto) {
    const { username, password } = dto;
    return this.authService.signin(username, password);
  }

  @Post('/signup')
  signup(@Body() dto: SigninUserDto) {
    const { username, password } = dto;
    // if (!username || !password) {
    //   throw new HttpException('请输入用户名和密码', 400);
    // }
    return this.authService.signup(username, password);
  }
}
