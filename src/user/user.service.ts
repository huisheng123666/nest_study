import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { Logs } from 'src/logs/logs.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Logs) private readonly logsRepositoy: Repository<Logs>,
  ) {}

  findAll() {
    return this.userRepository.find();
  }

  find(username: string) {
    return this.userRepository.findOne({ where: { username } });
  }

  findOne(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(user: User) {
    const userTmp = await this.userRepository.create(user);
    return this.userRepository.save(userTmp);
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

  addUser() {
    return {
      code: 0,
      data: [],
      msg: '添加用户成功',
    };
  }
}
