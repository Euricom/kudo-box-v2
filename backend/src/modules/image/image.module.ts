import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ImageClientService } from './service/image-client.service';

@Module({
    imports: [ConfigModule],
    providers: [ImageClientService, ConfigService],
    exports: [ImageClientService]
})
export class ImageModule {}
