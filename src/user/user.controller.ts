import { Body, Controller, Get, Patch, Put } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { IsAuth } from 'src/decorator/auth.decorator';
import { CurrentUser } from 'src/decorator/current-user.decorator';
import { PasswordDto } from './dto/password.dto';
import { UserUpdateDto } from './dto/user.dto';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all')
  async findAll() {
    return await this.userService.findAll();
  }

  @IsAuth()
  @Get('profile')
  @ApiResponse({ status: 400, description: 'Invalid request' })
  async profile(@CurrentUser() user: User) {
    return this.userService.profile(user);
  }

  @Get('profile/:id')
  async profileById(id: string) {
    return this.userService.getProfileById(id);
  }

  @IsAuth()
  @Put('update-password')
  async updatePassword(@CurrentUser() user: User, @Body() dto: PasswordDto) {
    return this.userService.updatePassword(user, dto);
  }

  @Patch('update')
  @IsAuth()
  async update(@CurrentUser() user: User, @Body() dto: UserUpdateDto) {
    return this.userService.update(user, dto);
  }
}
