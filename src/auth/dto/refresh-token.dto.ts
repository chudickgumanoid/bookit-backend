import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzM2OTQ0MTYzLCJleHAiOjE3MzY5NDU5NjN9.HW_ScdcIkf9BVQ8npub8VjhFnwJEqDBae12pPa_9TJA',
  })
  @IsString()
  refresh_token: string;
}
