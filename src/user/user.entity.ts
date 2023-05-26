import { Logs } from '../logs/logs.entity';
import { Roles } from '../roles/roles.entity';
import {
  AfterInsert,
  AfterRemove,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Profile } from './profile.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @OneToMany(() => Logs, (logs) => logs.user, { cascade: true })
  logs: Logs[];

  // 只在插入用户的时候执行，删除用户的时候不需要删除角色
  @ManyToMany(() => Roles, (roles) => roles.users, { cascade: ['insert'] })
  @JoinTable({ name: 'user_roles' })
  roles: Roles[];

  @OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
  profile: Profile;

  @AfterInsert()
  afterInsert() {
    console.log('afterInsert', this.id, this.username);
  }

  @AfterRemove()
  afterRemove() {
    console.log('afterRemove');
  }
}
