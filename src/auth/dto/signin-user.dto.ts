import { IsString, IsNotEmpty, Length } from 'class-validator';

export class SigninUserDto {
  @IsString()
  @IsNotEmpty({
    message: '请输入用户名！',
  })
  @Length(6, 20, {
    message:
      '用户名长度必须$constraint1到$constraint2之间，当前传递的值是：$value',
  })
  username: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  password: string;
}
