import {
  Body,
  Controller,
  Get,
  Patch,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { diskStorage } from 'multer';
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

  @IsAuth()
  @Patch('update')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './media',
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
    }),
  )
  async update(
    @CurrentUser() user: User,
    @Body() dto: UserUpdateDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      dto.avatar = `http://localhost:3000/media/${file.filename}`;
    }
    return this.userService.update(user, dto);
  }
}
