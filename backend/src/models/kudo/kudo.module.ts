import { Module } from '@nestjs/common';
import { KudoService } from './service/kudo.service';
import { KudoController } from './api/kudo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KudoRepository } from './data-access/kudo-repository';

@Module({
  imports: [TypeOrmModule.forFeature([KudoRepository])],
  controllers: [KudoController],
  providers: [KudoService]
})
export class KudoModule {}
