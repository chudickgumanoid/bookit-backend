import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Admin } from '@prisma/client';
import { CurrentUser } from 'src/decorator/current-user.decorator';
import { AdminAuthService } from './admin-auth.service';
import { AdminService } from './admin.service';
import { LoginAdminDto, RegisterAdminDto } from './dto/admin.dto';
import { IsAuth } from 'src/decorator/auth.decorator';
import { CreateVenueDto } from './dto/venue.dto';
import { CreateTicketTypeDto } from './dto/ticket.dto';

@ApiTags('admin')
@ApiBearerAuth('access-token')
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly adminAuthService: AdminAuthService,
  ) {}

  @Post('login')
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() dto: LoginAdminDto) {
    return await this.adminAuthService.login(dto);
  }

  @Post('register')
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'Register successful' })
  @ApiResponse({ status: 401, description: 'Invalid request' })
  async register(@Body() dto: RegisterAdminDto) {
    return await this.adminAuthService.register(dto);
  }

  @IsAuth()
  @Get('profile')
  async profile(@CurrentUser() admin: Admin) {
    return await this.adminService.profile(admin.id);
  }

  @IsAuth()
  @Get('venue/:city_id')
  async getVenueByCityId(city_id: string) {
    return await this.adminService.getVenueByCityId(city_id);
  }

  @IsAuth()
  @Post('venue')
  async createVenue(@Body() dto: CreateVenueDto) {
    return await this.adminService.createVenue(dto);
  }

  @IsAuth()
  @Get('ticket/type')
  async getTicketType() {
    return await this.adminService.getTicketType();
  }

  @IsAuth()
  @Post('ticket/type')
  async createTicket(@Body() dto: CreateTicketTypeDto) {
    return await this.adminService.createTicketType(dto);
  }
}
