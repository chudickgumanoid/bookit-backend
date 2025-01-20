import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto, AuthRegisterDto } from './dto/auth.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ActiveGuard } from 'src/utils/guards/active-user.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @Post('login')
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Login to the application' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @UseGuards(ActiveGuard)
  async login(@Body() dto: AuthLoginDto) {
    return await this.authService.login(dto);
  }

  @HttpCode(200)
  @Post('register')
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  async register(@Body() dto: AuthRegisterDto) {
    return await this.authService.register(dto);
  }

  @HttpCode(200)
  @Post('refresh-token')
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Reset user password' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  async getNewToken(@Body() dto: RefreshTokenDto) {
    return await this.authService.getNewToken(dto.refresh_token);
  }
}
