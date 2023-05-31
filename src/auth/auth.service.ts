import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  signin(username: string, password: string) {
    return this.userService.create({
      username,
      password,
    });
  }

  signup(username: string, password: string) {
    return this.userService.create({
      username,
      password,
    });
  }
}
