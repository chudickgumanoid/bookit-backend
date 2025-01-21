import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';
import { IsEmailFormat } from 'src/decorator/email.decorator';
import { messageMinText } from 'src/utils/lengthMessage';

export class RegisterAdminDto {
  @IsString()
  @ApiProperty({ description: 'Nickname', example: 'admin' })
  nickname: string;

  @IsString()
  @IsEmailFormat({ message: 'Invalid email format' })
  @ApiProperty({ description: 'User email', example: 'john@example.com' })
  email: string;

  @IsString()
  @MinLength(4, messageMinText(4))
  @ApiProperty({
    description: 'Password for the account',
    example: '1234',
  })
  password: string;
}

export class LoginAdminDto extends PartialType(RegisterAdminDto) {}
