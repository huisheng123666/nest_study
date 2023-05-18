import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { Logs } from '../logs/logs.entity';
import { GetUserDto } from './get-user-dto';
import { conditionUtils } from 'src/utils/db.helper';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Logs) private readonly logsRepositoy: Repository<Logs>,
  ) {}

  findAll(query: GetUserDto) {
    const { limit = 10, page, username, role, gender } = query;
    const skip = (page - 1) * limit;

    // return this.userRepository.find({
    //   select: {
    //     id: true,
    //     username: true,
    //   },
    //   relations: {
    //     profile: true,
    //     roles: true,
    //   },
    //   where: {
    //     username,
    //     profile: {
    //       gender,
    //     },
    //     roles: {
    //       id: role,
    //     },
    //   },
    //   take: limit,
    //   skip: (page - 1) * limit,
    // });
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect('user.roles', 'roles');

    const obj = {
      'user.username': username,
      'profile.gender': gender,
      'roles.id': role,
    };
    conditionUtils<User>(queryBuilder, obj);

    return queryBuilder.take(limit).skip(skip).getMany();
  }

  find(username: string) {
    return this.userRepository.findOne({ where: { username } });
  }

  findOne(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(user: User) {
    const userTmp = await this.userRepository.create(user);
    // try {
    const res = await this.userRepository.save(userTmp);
    return res;
    // } catch (error) {
    //   if (error.errno === 1062) {
    //     throw new HttpException(error.sqlMessage, 500);
    //   }
    // }
  }

  async update(id: number, user: Partial<User>) {
    return this.userRepository.update(id, user);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }

  findProfile(id: number) {
    return this.userRepository.findOne({
      where: { id },
      relations: {
        profile: true,
      },
    });
  }

  async findUserLogs(id: number) {
    const user = await this.findOne(id);
    return this.logsRepositoy.find({
      where: { user },
      // relations: {
      //   user: true,
      // },
    });
  }

  async findLogsByGroup(id: number) {
    // SELECT logs.result, COUNT(logs.result) from logs, user WHERE user.id = logs.userId AND user.id = 1 GROUP BY logs.result;
    return this.logsRepositoy
      .createQueryBuilder('logs')
      .select('logs.result', 'result')
      .addSelect('COUNT("logs.result")', 'count')
      .leftJoinAndSelect('logs.user', 'user')
      .where('user.id = :id', { id })
      .groupBy('logs.result')
      .orderBy('result', 'DESC')
      .addOrderBy('count', 'DESC')
      .getRawMany();
  }

  addUser(user: User) {
    return {
      code: 0,
      data: [user],
      msg: '添加用户成功',
    };
  }
}
