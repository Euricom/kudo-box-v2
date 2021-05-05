import { Module } from '@nestjs/common';
import { KudoService } from './service/kudo.service';
import { KudoController } from './api/kudo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KudoRepository } from './data-access/kudo.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { validateImage } from './api/validator/file-validator';
import { ImageClientService } from './service/image-client.service';
import { memoryStorage } from 'multer';

@Module({
  imports: [
    TypeOrmModule.forFeature([KudoRepository]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        fileFilter: validateImage,
        storage: memoryStorage(),
        limits: { fileSize: configService.get<number>('IMAGE_MAX_SIZE') }
      })
    }),
    ConfigModule
  ],
  controllers: [KudoController],
  providers: [KudoService, ImageClientService],
  // refactor into different module
  exports: [ImageClientService]
})
export class KudoModule {}
