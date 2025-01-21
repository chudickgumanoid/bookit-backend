import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateVenueDto {
  @IsString()
  @ApiProperty({ description: 'Venue title', example: 'Концерт Джизус' })
  name: string;

  @IsString()
  @ApiProperty({
    description: 'Venue name',
    example: '7957b99e-681d-4b11-9824-1f30700b2c83',
  })
  locationId: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Seat map', example: '' })
  seatMapUrl: string;
}
