import {
  Body,
  Controller,
  Get,
  Patch,
  Put,
  UploadedFile,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { IsAuth } from 'src/decorator/auth.decorator';
import { CurrentUser } from 'src/decorator/current-user.decorator';
import { FileUpload } from 'src/decorator/file-upload.decorator';
import { PasswordDto } from './dto/password.dto';
import { UserUpdateDto } from './dto/user.dto';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';

@ApiTags('user')
@ApiBearerAuth('access-token')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @IsAuth()
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

  @IsAuth()
  @Patch('update')
  @FileUpload({ key: 'avatar', path: './media/avatars' })
  async update(
    @CurrentUser() user: User,
    @Body() dto: UserUpdateDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const cfg = new ConfigService();
    if (file) {
      dto.avatar = `http://localhost:${cfg.get('BK_DEV_PORT')}/media/avatars/${file.filename}`;
    }
    return this.userService.update(user, dto);
  }

  @IsAuth()
  @Get('my-tickets')
  async getMyTickets(@CurrentUser() user: User) {
    return await this.userService.getMyTickets(user.id);
  }

  @IsAuth()
  @Get('history')
  async history(@CurrentUser() user: User) {
    return await this.userService.history(user.id);
  }

  @IsAuth()
  @Patch('delete-account')
  async deleteProfile(@CurrentUser() user: User) {
    return await this.userService.deleteProfile(user.id);
  }
}
