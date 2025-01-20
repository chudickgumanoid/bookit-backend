import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/utils/guards/jwt-auth.guard';

export const IsAuth = () => UseGuards(JwtAuthGuard);
