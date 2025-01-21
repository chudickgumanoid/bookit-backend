import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCityDto {
  @IsString()
  @ApiProperty({ description: 'City title', example: 'Astana' })
  title: string;

  @IsString()
  @ApiProperty({ description: 'City name', example: 'Астана' })
  name: string;
}

export class UpdateCityDto extends PartialType(CreateCityDto) {}
