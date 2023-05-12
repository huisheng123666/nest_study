import { Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { ConfigEnum } from 'src/enum/config.enum';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {}

  @Get()
  getUsers(): any {
    console.log(this.configService.get(ConfigEnum.DB_PORT));

    return this.userService.findAll();
  }

  @Post()
  addUser() {
    return this.userService.addUser();
  }

  @Get('profile')
  getUserProfile() {
    return this.userService.findProfile(1);
  }

  @Get('logs')
  getUserLogs() {
    return this.userService.findUserLogs(1);
  }

  @Get('logsByGroup')
  async getLogsByGroup() {
    const res = await this.userService.findLogsByGroup(1);
    return res.map((o) => ({
      result: o.result,
      count: o.count,
    }));
  }
}
