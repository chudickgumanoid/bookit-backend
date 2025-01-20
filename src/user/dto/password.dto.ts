import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';
import { messageMinText } from 'src/utils/lengthMessage';

export class PasswordDto {
  @ApiProperty({ description: 'Previous password', example: '1111' })
  @IsString()
  @MinLength(4, messageMinText(4))
  previos_password: string;

  @ApiProperty({ description: 'New password', example: '1234' })
  @IsString()
  @MinLength(4, messageMinText(4))
  password: string;

  @ApiProperty({ description: 'New password repeat', example: '1234' })
  @IsString()
  @MinLength(4, messageMinText(4))
  new_password: string;
}
