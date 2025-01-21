import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Admin, User } from '@prisma/client';

type TokenPayload = {
  id: string;
  role: 'USER' | 'ADMIN';
};

@Injectable()
export class TokenService {
  constructor(
    private jwt: JwtService,
    private cfg: ConfigService,
  ) {}

  async issueTokens(
    userOrAdmin: Admin | User,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const data: TokenPayload = { id: userOrAdmin.id, role: userOrAdmin.role };

    const accessToken = this.jwt.sign(data, {
      secret: this.cfg.get('BK_JWT_SECRET'),
      expiresIn: this.cfg.get('BK_ACCESS_TOKEN_EXPIRES', '1h'),
    });

    const refreshToken = this.jwt.sign(data, {
      secret: this.cfg.get('BK_JWT_SECRET'),
      expiresIn: this.cfg.get('BK_REFRESH_TOKEN_EXPIRES', '7d'),
    });

    return { accessToken, refreshToken };
  }

  async decodeToken(token: string): Promise<Admin | User | null> {
    try {
      const decoded = this.jwt.verify<TokenPayload>(token, {
        secret: this.cfg.get('BK_JWT_SECRET'),
      });

      if (decoded) {
        if (decoded.role === 'ADMIN') {
          return { id: decoded.id, role: 'ADMIN' } as Admin;
        } else if (decoded.role === 'USER') {
          return { id: decoded.id, role: 'USER' } as User;
        }
      }
      return null;
    } catch (e) {
      return null;
    }
  }
}
