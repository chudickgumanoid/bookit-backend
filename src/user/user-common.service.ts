import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserCommonService {
  constructor(private prisma: PrismaService) {}

  async isExistsUser(email: string, currentUserId?: string) {
    const isExistEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (isExistEmail && (!currentUserId || currentUserId !== isExistEmail.id)) {
      throw new BadRequestException('Email already exists');
    }
  }
}
