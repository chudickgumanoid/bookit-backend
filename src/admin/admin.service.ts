import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

type ExcludeField<T, K extends keyof T> = Omit<T, K>;

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async profile(admin_id: string) {
    const admin = await this.prisma.admin.findUnique({
      where: {
        id: admin_id,
      },
    });

    return this.excludeField(admin, 'password');
  }

  private excludeField<T, K extends keyof T>(
    obj: T,
    key: K,
  ): ExcludeField<T, K> {
    const { [key]: ignored, ...rest } = obj;
    void ignored;
    return rest as ExcludeField<T, K>;
  }
}
