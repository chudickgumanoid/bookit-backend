import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserCommonService } from './user-common.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    PrismaModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'media'), // Путь для хранения файлов
      serveRoot: '/media', // URL для доступа к файлам
    }),
  ],
  controllers: [UserController],
  providers: [UserService, UserCommonService],
})
export class UserModule {}
