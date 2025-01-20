import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import type { User } from '@prisma/client';
import { hash, verify } from 'argon2';
import { PrismaService } from 'src/prisma.service';
import { PasswordDto } from './dto/password.dto';
import { UserUpdateDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserById(id: string) {
    return await this.prisma.user.findUnique({
      where: { id: id },
    });
  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async profile(user: User) {
    return await this.prisma.user.findUnique({
      where: { id: user.id },
    });
  }

  async updatePassword(user: User, dto: PasswordDto) {
    const isValid = await verify(user.password, dto.previos_password);
    const isSamePassword = await verify(user.password, dto.new_password);

    if (!isValid) throw new BadRequestException('Invalid old password');
    if (isSamePassword)
      throw new BadRequestException('New password is the same as the old one');

    if (dto.password !== dto.new_password)
      throw new BadRequestException('Invalid confirm password');

    const update = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: await hash(dto.password),
      },
    });

    if (update) {
      throw new HttpException('Succes change password', HttpStatus.OK);
    }
  }

  async update(user: User, dto: UserUpdateDto) {
    return await this.prisma.user.update({
      where: { id: user.id },
      data: {
        firstName: dto.first_name,
        lastName: dto.last_name,
        email: dto.email,
        avatarUrl: dto.avatar,
        dateBirth: dto.dateBirth,
        cityId: dto.city,
      },
    });
  }

  async getProfileById(id: string) {
    return await this.prisma.user.findUnique({
      where: { id: id },
    });
  }
}
