import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole, UserStatus } from '@prisma/client';
import { hash, verify } from 'argon2';
import { UserCommonService } from 'src/user/user-common.service';
import { UserService } from 'src/user/user.service';
import { PrismaService } from './../prisma.service';
import { AuthLoginDto, AuthRegisterDto } from './dto/auth.dto';
import { returnUserShortFields } from './return-user-object';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private user: UserService,
    private userCommon: UserCommonService,
    private cfg: ConfigService,
  ) {}

  async login(dto: AuthLoginDto) {
    const user = await this.validateUser(dto);
    const tokens = await this.issueTokens(user.id);

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
        const tokens = await this.issueTokens(existingUser.id);

        return {
          user: returnUserShortFields(updatetUser),
          ...tokens,
        };
      }
    } else {
      const user = await this.createUser(dto, dto.password);

      const tokens = await this.issueTokens(user.id);

      return {
        user: returnUserShortFields(user),
        ...tokens,
      };
    }
  }

  private async createUser(dto: AuthRegisterDto, password: string) {
    const pwd = await hash(password);

    return await this.prisma.user.create({
      data: {
        firstName: dto.first_name,
        lastName: dto.last_name,
        email: dto.email,
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
        password: pwd,
        isVerify: false,
      },
    });
  }

  async getNewToken(refreshToken: string) {
    try {
      const res = await this.jwt.verifyAsync(refreshToken);
      if (!res) {
        throw new UnauthorizedException('Invalid refresh tokens');
      }

      const user = await this.user.getUserById(res.id);
      const tokens = await this.issueTokens(user.id);

      return {
        user: returnUserShortFields(user),
        ...tokens,
      };
    } catch (error) {
      throw new BadRequestException('Invalid signature');
    }
  }

  private async issueTokens(user_id: string) {
    const data = { id: user_id };
    const accessToken = this.jwt.sign(data, {
      expiresIn: this.cfg.get('BK_ACCESS_TOKEN_EXPIRES'),
    });
    const refreshToken = this.jwt.sign(data, {
      expiresIn: this.cfg.get('BK_REFRESH_TOKEN_EXPIRES'),
    });

    return { accessToken, refreshToken };
  }

  private async validateUser(dto: AuthLoginDto) {
    let user: User | null = null;

    user = await this.prisma.user.findFirst({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    const isValid = await verify(user.password, dto.password);

    if (!isValid) throw new BadRequestException('Invalid password');

    return user;
  }
}
