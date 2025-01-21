import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateTicketTypeDto {
  @IsString()
  @ApiProperty({ description: 'Ticket name', example: 'Концерт Джизус' })
  name: string;

  @IsNumber()
  @ApiProperty({ description: 'Ticket title', example: 'Концерт Джизус' })
  price: number;

  @IsString()
  @ApiProperty({ description: 'Ticket description', example: 'Концерт Джизус' })
  description?: string;
}

export class CreateTicketDto {
  @IsString()
  @ApiProperty({ description: 'Ticket name', example: 'Концерт Джизус' })
  eventId: string;

  @IsString()
  @ApiProperty({ description: 'Ticket name', example: 'Концерт Джизус' })
  seatNumber: string;

  @IsNumber()
  @ApiProperty({ description: 'Ticket title', example: 'Концерт Джизус' })
  price: number;

  @IsString()
  @ApiProperty({ description: 'Ticket name', example: 'Концерт Джизус' })
  ticketTypeId: string;
}
