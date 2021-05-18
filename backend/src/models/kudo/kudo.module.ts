import { Module } from '@nestjs/common';
import { KudoService } from './service/kudo.service';
import { KudoController } from './api/kudo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KudoRepository } from './data-access/kudo.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { validateImage } from './api/validator/file-validator';
import { ImageClientService } from '../../modules/image/service/image-client.service';
import { memoryStorage } from 'multer';
import { ImageModule } from 'src/modules/image/image.module';
import { EventModule } from '../event/event.module';
import { EventService } from '../event/service/event/event.service';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/service/user.service';
import { EventRepository } from '../event/data-access/event/event.repository';
import { UserRepository } from '../user/data-access/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([KudoRepository, EventRepository, UserRepository]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        fileFilter: validateImage,
        storage: memoryStorage(),
        limits: { fileSize: configService.get<number>('IMAGE_MAX_SIZE') }
      })
    }),
    ConfigModule,
    ImageModule,
    EventModule,
    UserModule
  ],
  controllers: [KudoController],
  providers: [KudoService, ImageClientService, EventService, UserService],
})
export class KudoModule {}
