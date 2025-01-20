import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsEmailFormat } from 'src/decorator/email.decorator';

export class UserUpdateDto {
  @ApiProperty({ description: 'User email', example: 'john@example.com' })
  @IsString()
  @IsEmailFormat({ message: 'Invalid email format' })
  email: string;

  @ApiProperty({ description: 'Last name', example: 'Doe' })
  @IsString()
  last_name: string;

  @ApiProperty({ description: 'First name', example: 'John' })
  @IsString()
  first_name: string;

  @IsString()
  avatarUrl: string;
}
