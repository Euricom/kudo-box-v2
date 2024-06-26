import { forwardRef, Module } from '@nestjs/common';
import { EventService } from './service/event/event.service';
import { EventController } from './api/event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventRepository } from './data-access/event/event.repository';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { memoryStorage } from 'multer';
import { validateImage } from './api/validator/file-validator';
import { TagService } from './service/tag/tag.service';
import { ImageModule } from '../../modules/image/image.module';
import { TagRepository } from './data-access/tag/tag.repository';
import { EventMapper } from './api/mapper/event-mapper';
import { UserModule } from '../user/user.module';
import { EventRoomGateway } from './api/ws/event-room-gateway';
import { KudoModule } from '../kudo/kudo.module';

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
    ImageModule,
    UserModule,
    forwardRef(() => KudoModule)
  ],
  controllers: [EventController],
  providers: [EventService, TagService, EventMapper, EventRoomGateway],
  exports: [EventService, EventMapper]
})
export class EventModule {}
