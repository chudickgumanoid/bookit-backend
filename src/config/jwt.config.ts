import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const getJwtConfig = async (
  cfg: ConfigService,
): Promise<JwtModuleOptions> => {
  const secret = cfg.get<string>('BK_JWT_SECRET');
  if (!secret) {
    throw new Error('JWT secret is not defined in the environment variables');
  }

  return {
    secret,
  };
};
