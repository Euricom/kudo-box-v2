import { Module } from '@nestjs/common';
import { EventService } from './service/event/event.service';
import { EventController } from './api/event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventRepository } from './data-access/event.repository';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { memoryStorage } from 'multer';
import { KudoModule } from '../kudo/kudo.module';
import { ImageClientService } from '../kudo/service/image-client.service';
import { validateImage } from './api/validator/file-validator';
import { TagService } from './service/tag/tag.service';
import { TagRepository } from './data-access/tag.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventRepository, TagRepository]),
    ConfigModule,
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        fileFilter: validateImage,
        storage: memoryStorage(),
        limits: { fileSize: configService.get<number>('IMAGE_MAX_SIZE') }
      })
    }),
    KudoModule
  ],
  controllers: [EventController],
  providers: [EventService, ImageClientService, TagService, ConfigService]
})
export class EventModule {}
