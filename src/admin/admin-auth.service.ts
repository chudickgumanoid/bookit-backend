import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Admin } from '@prisma/client';
import { hash, verify } from 'argon2';
import { TokenService } from 'src/auth/token.service';
import { PrismaService } from 'src/prisma.service';
import { LoginAdminDto, RegisterAdminDto } from './dto/admin.dto';
import { returnAdminFields } from './return-admin-object';

@Injectable()
export class AdminAuthService {
  constructor(
    private prisma: PrismaService,
    private token: TokenService,
  ) {}

  async login(dto: LoginAdminDto) {
    const admin = await this.findAdmin(dto);

    const tokens = await this.token.issueTokens(admin);

    return {
      admin: returnAdminFields(admin),
      ...tokens,
    };
  }

  async register(dto: RegisterAdminDto) {
    const checkEmail = await this.isExistEmail(dto.email);
    const checkNickname = await this.isExistNickname(dto.nickname);

    if (checkEmail) throw new Error('Email already exists');
    if (checkNickname) throw new Error('Nickname already exists');

    const pwd: string = await hash(dto.password);
    const admin = await this.prisma.admin.create({
      data: {
        email: dto.email,
        nickname: dto.nickname,
        password: pwd,
      },
    });
    return { ...returnAdminFields(admin) };
  }

  private async isExistEmail(email: string) {
    return await this.prisma.admin.findUnique({
      where: {
        email: email,
      },
    });
  }

  private async isExistNickname(nickname: string) {
    return await this.prisma.admin.findUnique({
      where: {
        nickname: nickname,
      },
    });
  }

  private async findAdmin(dto: LoginAdminDto) {
    let admin: Admin | null = null;

    admin = await this.prisma.admin.findFirst({
      where: {
        OR: [{ nickname: dto.nickname }, { email: dto.email }],
      },
    });

    if (!admin) throw new NotFoundException('Admin not found');

    const isPasswordValid = await verify(admin.password, dto.password);
    if (!isPasswordValid) throw new BadRequestException('Invalid password');

    return admin;
  }
}
