import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  LoggerService,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseFilters,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { User } from './user.entity';
import { GetUserDto } from './dto/get-user-dto';
import { TypeormFilter } from 'src/filters/typeorm.filter';
import { CreateUserPipe } from './pipes/create-user.pipe';
import { CreateUserDto } from './dto/create-user-dto';

@Controller('user')
@UseFilters(new TypeormFilter())
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
  addUser(@Body(CreateUserPipe) dto: CreateUserDto) {
    const user = dto as User;
    return this.userService.create(user);
  }

  @Get('profile')
  getUserProfile(@Query('id', ParseIntPipe) id: any) {
    console.log(
      '🚀 ~ file: user.controller.ts:51 ~ UserController ~ getUserProfile ~ id:',
      typeof id,
    );
    return this.userService.findProfile(id);
  }

  @Get('/:id')
  getUser() {
    return 'hello word';
  }

  @Patch('/:id')
  updateUser(@Body() dto: User, @Param('id') id: number) {
    return this.userService.update(id, dto);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: number) {
    return this.userService.remove(id);
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
