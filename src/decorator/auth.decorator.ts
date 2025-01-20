import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export const IsAuth = () => UseGuards(AuthGuard('jwt'));
