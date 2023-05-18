import {
  Body,
  Controller,
  Get,
  Inject,
  LoggerService,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { User } from './user.entity';
import { GetUserDto } from './get-user-dto';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {
    this.logger.log('UserController init');
  }

  @Get()
  getUsers(@Query() dto: GetUserDto): any {
    console.log(
      '🚀 ~ file: user.controller.ts:38 ~ UserController ~ getUsers ~ dto:',
      dto,
    );
    // this.logger.log('请求用户成功');
    return this.userService.findAll(dto);
  }

  @Post()
  addUser(@Body() dto: any) {
    const user = dto as User;
    return this.userService.addUser(user);
  }

  @Get('profile')
  getUserProfile(@Query('id') query: any) {
    console.log(
      '🚀 ~ file: user.controller.ts:42 ~ UserController ~ getUserProfile ~ query:',
      query,
    );
    return this.userService.findProfile(1);
  }

  @Get('/:id')
  getUser() {
    return 'hello word';
  }

  @Patch('/:id')
  updateUser(@Body() dto: any, @Param('id') id: number) {
    return { id };
  }

  // todo
  // logs module
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
