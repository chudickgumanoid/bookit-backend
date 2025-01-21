import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Admin, User } from '@prisma/client';

export const CurrentUser = createParamDecorator(
  (data: keyof Admin | keyof User | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const userOrAdmin = request.user;

    return data ? userOrAdmin?.[data] : userOrAdmin;
  },
);
