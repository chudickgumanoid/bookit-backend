import { User } from '@prisma/client';

export const returnUserShortFields = (user: User) => {
  return {
    id: user.id,
    email: user.email,
    status: user.status,
  };
};

export const returnUserFields = (user: User) => {
  return {
    id: user.id,
    first_name: user.firstName,
    last_name: user.lastName,
    avatar_url: user.avatarUrl,
    email: user.email,
    role: user.role,
    status: user.status,
    isVerify: user.isVerify,
    dateBirth: user.dateBirth,
    city: user.cityId,
  };
};
