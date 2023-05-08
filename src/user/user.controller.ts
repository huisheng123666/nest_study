import { Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getUsers(): any {
    console.log(3434);

    return this.userService.getUsers();
  }

  @Post()
  addUser() {
    return this.userService.addUser();
  }
}
