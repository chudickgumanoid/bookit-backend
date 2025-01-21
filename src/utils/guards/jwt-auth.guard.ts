import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private prisma: PrismaService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAuth = await super.canActivate(context);

    if (!isAuth) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id;
    const role = request.user?.role;

    if (!userId) {
      throw new ForbiddenException('User not found');
    }

    if (role === 'USER') {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user || user.status !== UserStatus.ACTIVE) {
        throw new ForbiddenException('User is not active');
      }
    } else if (role === 'ADMIN') {
      await this.prisma.admin.findUnique({
        where: { id: userId },
      });
    } else {
      throw new ForbiddenException('Invalid role');
    }

    return true;
  }
}
