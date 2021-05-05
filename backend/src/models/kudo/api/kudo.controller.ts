import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UploadedFile } from '@nestjs/common';
import { Response } from 'express';
import { KudoService } from '../service/kudo.service';
import { CreateKudoApi } from './kudo-endpoint.decorator';
import { CreateKudoDto } from './dto/create-kudo.dto';
import { UpdateKudoDto } from './dto/update-kudo.dto';
import { KudoMapper } from './mapper/kudo-mapper';
import { ApiTags } from '@nestjs/swagger';

@Controller('kudo')
@ApiTags('Kudo')
export class KudoController {
  constructor(private readonly kudoService: KudoService) {}

  @Post('create')
  @CreateKudoApi()
  async create(
      @UploadedFile() kudoImage: Express.Multer.File,
      @Body() createKudoDto: CreateKudoDto,
      @Res() res: Response
    ): Promise<void> {
      const createdKudo = await this.kudoService.createImageEntity(KudoMapper.fromCreateKudoDto(createKudoDto), kudoImage);
      res.header('Location', `/kudo/${createdKudo.id}`).send();
  }
}
