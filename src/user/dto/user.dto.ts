import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsOptional, IsString } from 'class-validator';
import { IsEmailFormat } from 'src/decorator/email.decorator';

export class UserUpdateDto {
  @IsString()
  @IsEmailFormat({ message: 'Invalid email format' })
  @ApiProperty({ description: 'User email', example: 'john@example.com' })
  email: string;

  @IsString()
  @ApiProperty({ description: 'Last name', example: 'Doe' })
  last_name: string;

  @ApiProperty({ description: 'First name', example: 'John' })
  @IsString()
  first_name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Avatar URL',
    example: 'http://localhost:3000/media/12345-avatar.jpg',
  })
  avatar?: string;

  @IsString()
  @IsDate()
  @IsOptional()
  @ApiProperty({ description: 'User birth date', example: '1990-01-01' })
  dateBirth?: Date;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'User city', example: 'Astana' })
  city: string;
}
