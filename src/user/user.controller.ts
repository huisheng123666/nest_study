import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  LoggerService,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
// import { Logger } from 'nestjs-pino';

@Controller('user')
export class UserController {
  // private logger = new Logger(UserController.name);

  constructor(
    private userService: UserService,
    private configService: ConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {
    this.logger.log('UserController init');
  }

  @Get()
  getUsers(): any {
    // this.logger.log('请求用户成功');
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
