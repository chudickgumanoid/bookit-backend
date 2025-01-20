import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserStatus } from '@prisma/client';

@Injectable()
export class ActiveGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id;

    if (!userId) {
      throw new ForbiddenException('User not found');
    }

    // Проверяем статус пользователя на ACTIVE
    const isActive = await this.checkUserStatus(userId);
    if (!isActive) {
      throw new ForbiddenException('User is not active');
    }

    return true;
  }

  private async checkUserStatus(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.status !== UserStatus.ACTIVE) {
      return false;
    }

    return true;
  }
}
