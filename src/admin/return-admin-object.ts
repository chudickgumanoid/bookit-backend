import { Admin } from '@prisma/client';

export const returnAdminFields = (admin: Admin) => {
  return {
    id: admin.id,
    nickname: admin.nickname,
    email: admin.email,
    role: admin.role,
  };
};
