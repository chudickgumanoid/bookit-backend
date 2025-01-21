import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserStatus } from '@prisma/client';
import { UserCommonService } from 'src/user/user-common.service';
import { UserService } from 'src/user/user.service';
import { PrismaService } from './../prisma.service';
import { AuthLoginDto, AuthRegisterDto } from './dto/auth.dto';
import { returnUserShortFields } from './return-user-object';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private user: UserService,
    private userCommon: UserCommonService,
    private cfg: ConfigService,
    private token: TokenService,
  ) {}

  async login(dto: AuthLoginDto) {
    const user = await this.userCommon.validateUser(dto);
    const tokens = await this.token.issueTokens(user);

    return {
      user: returnUserShortFields(user),
      ...tokens,
    };
  }

  async register(dto: AuthRegisterDto) {
    const existingUser = await this.userCommon.isExistsUser(dto.email);

    if (existingUser) {
      if (existingUser.status === UserStatus.ACTIVE) {
        throw new BadRequestException('Email already exists');
      }

      if (existingUser.status === UserStatus.DELETED) {
        const updatetUser = await this.userCommon.reRegister(
          existingUser.id,
          dto,
        );
        const tokens = await this.token.issueTokens(existingUser);

        return {
          user: returnUserShortFields(updatetUser),
          ...tokens,
        };
      }
    } else {
      const transaction = await this.prisma.$transaction(async () => {
        const user = await this.userCommon.createUser(dto, dto.password);

        const tokens = await this.token.issueTokens(user);

        if (!tokens) throw new Error('Failed to issue tokens');

        return {
          user: returnUserShortFields(user),
          ...tokens,
        };
      });

      return transaction;
    }
  }

  async getNewToken(refreshToken: string) {
    try {
      const res = await this.jwt.verifyAsync(refreshToken);
      if (!res) {
        throw new UnauthorizedException('Invalid refresh tokens');
      }

      const user = await this.user.getUserById(res.id);
      const tokens = await this.token.issueTokens(user);

      return {
        user: returnUserShortFields(user),
        ...tokens,
      };
    } catch (error) {
      throw new BadRequestException('Invalid signature');
    }
  }
}
