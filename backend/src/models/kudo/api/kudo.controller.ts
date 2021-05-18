import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UploadedFile, BadRequestException } from '@nestjs/common';
import { Response } from 'express';
import { KudoService } from '../service/kudo.service';
import { CreateKudoApi } from './decorator/kudo-endpoint.decorator';
import { CreateKudoDto } from './dto/create-kudo.dto';
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
      // throw new BadRequestException('test');
      const createdKudo = await this.kudoService.create(KudoMapper.fromCreateKudoDto(createKudoDto), kudoImage);
      res.header('Location', `/kudo/${createdKudo.id}`).send();
  }
}
