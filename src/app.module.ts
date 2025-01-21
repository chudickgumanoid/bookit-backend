import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { SPLogger } from './utils/logger.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CityModule } from './city/city.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UserModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'media'),
      serveRoot: '/media',
    }),
    CityModule,
    AdminModule,
  ],
  controllers: [AppController, UserController],
  providers: [
    AppService,
    {
      provide: SPLogger,
      useClass: SPLogger,
    },
    UserService,
  ],
})
export class AppModule {}
