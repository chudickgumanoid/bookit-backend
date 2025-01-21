import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private prisma: PrismaService,
    cfg: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: cfg.get('BK_JWT_SECRET'),
    });
  }

  async validate(payload: { id: string; role: 'USER' | 'ADMIN' }) {
    const { id, role } = payload;

    if (role === 'USER') {
      return await this.prisma.user.findUnique({
        where: { id: id },
      });
    } else if (role === 'ADMIN') {
      return await this.prisma.admin.findUnique({
        where: { id: id },
      });
    } else throw new Error('Invalid role');
  }
}
