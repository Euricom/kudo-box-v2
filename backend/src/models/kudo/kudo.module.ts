import { Module } from '@nestjs/common';
import { KudoService } from './service/kudo.service';
import { KudoController } from './api/kudo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KudoRepository } from './data-access/kudo-repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { validateImage } from './api/validator/file-validator';

@Module({
  imports: [
    TypeOrmModule.forFeature([KudoRepository]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        fileFilter: validateImage,
        limits: {
          // This is not working, image file size is able to exceed limit
          fileSize: configService.get<number>('IMAGE_MAX_SIZE')
        }
      })
    })
  ],
  controllers: [KudoController],
  providers: [KudoService]
})
export class KudoModule {}
