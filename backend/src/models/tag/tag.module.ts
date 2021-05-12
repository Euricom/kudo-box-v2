import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagController } from './api/tag.controller';
import { TagRepository } from './data-access/tag.repository';
import { TagService } from './service/tag.service';

@Module({
    imports: [TypeOrmModule.forFeature([TagRepository])],
    controllers: [TagController],
    providers: [TagService],
    exports: [TagService, TypeOrmModule]
})
export class TagModule {}
