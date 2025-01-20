import { Injectable } from '@nestjs/common';
import { UserStatus } from '@prisma/client';
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
    return await this.prisma.user.update({
      where: {
        id: user_id,
      },
      data: {
        status: UserStatus.ACTIVE,
        password: dto.password,
      },
    });
  }
}
