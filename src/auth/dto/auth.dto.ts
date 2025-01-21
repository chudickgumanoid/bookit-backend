import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';
import { IsEmailFormat } from 'src/decorator/email.decorator';
import { messageMinText } from 'src/utils/lengthMessage';

export class AuthRegisterDto {
  @IsString()
  @IsEmailFormat({ message: 'Invalid email format' })
  @ApiProperty({ description: 'User email', example: 'john@example.com' })
  email: string;

  @IsString()
  @ApiProperty({ description: 'Last name', example: 'Doe' })
  last_name: string;

  @IsString()
  @ApiProperty({ description: 'First name', example: 'John' })
  first_name: string;

  @IsString()
  @MinLength(4, messageMinText(4))
  @ApiProperty({
    description: 'Password for the account',
    example: '1234',
  })
  password: string;
}

export class AuthLoginDto {
  @ApiPropertyOptional({
    description: 'User email (optional)',
    example: 'john@example.com',
  })
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'Password for the account',
    example: '1234',
  })
  @IsString()
  @MinLength(4, messageMinText(4))
  password: string;
}
