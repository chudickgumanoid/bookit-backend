import { Injectable } from '@nestjs/common';
import { UserRole, UserStatus } from '@prisma/client';
import { hash } from 'argon2';
import { AuthRegisterDto } from 'src/auth/dto/auth.dto';
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
}
