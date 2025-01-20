import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { getJwtConfig } from 'src/config/jwt.config';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserCommonService } from 'src/user/user-common.service';
import { UserService } from 'src/user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJwtConfig,
    }),
    PrismaModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, UserCommonService, JwtStrategy],
})
export class AuthModule {}
