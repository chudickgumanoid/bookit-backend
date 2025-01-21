import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User, UserRole, UserStatus } from '@prisma/client';
import { hash, verify } from 'argon2';
import { AuthLoginDto, AuthRegisterDto } from 'src/auth/dto/auth.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserCommonService {
  constructor(private prisma: PrismaService) {}

  async isExistsUser(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async reRegister(user_id: string, dto: AuthRegisterDto) {
    const pwd = await hash(dto.password);

    return await this.prisma.user.update({
      where: {
        id: user_id,
      },
      data: {
        firstName: dto.first_name,
        lastName: dto.last_name,
        email: dto.email,
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
        password: pwd,
        isVerify: false,
      },
    });
  }

  async createUser(dto: AuthRegisterDto, password: string) {
    const pwd = await hash(password);

    return await this.prisma.user.create({
      data: {
        firstName: dto.first_name,
        lastName: dto.last_name,
        email: dto.email,
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
        password: pwd,
        isVerify: false,
      },
    });
  }

  async validateUser(dto: AuthLoginDto) {
    let user: User | null = null;

    user = await this.prisma.user.findFirst({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    const isValid = await verify(user.password, dto.password);

    if (!isValid) throw new BadRequestException('Invalid password');

    return user;
  }
}
