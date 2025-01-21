import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthLoginDto, AuthRegisterDto } from './dto/auth.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @Post('login')
  @ApiOperation({ summary: 'Login to the application' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  // @UseGuards(ActiveGuard)
  async login(@Body() dto: AuthLoginDto) {
    return await this.authService.login(dto);
  }

  @HttpCode(200)
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  async register(@Body() dto: AuthRegisterDto) {
    return await this.authService.register(dto);
  }

  @HttpCode(200)
  @Post('refresh-token')
  @ApiOperation({ summary: 'Reset user password' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  async getNewToken(@Body() dto: RefreshTokenDto) {
    return await this.authService.getNewToken(dto.refresh_token);
  }
}
