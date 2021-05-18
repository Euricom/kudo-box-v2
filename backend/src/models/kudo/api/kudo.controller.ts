import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UploadedFile, BadRequestException } from '@nestjs/common';
import { Response } from 'express';
import { KudoService } from '../service/kudo.service';
import { CreateKudoApi } from './decorator/kudo-endpoint.decorator';
import { CreateKudoDto } from './dto/in/create-kudo.dto';
import { KudoMapper } from './mapper/kudo-mapper';
import { ApiTags } from '@nestjs/swagger';
import { KudoDto } from './dto/out/Kudo.dto';

@Controller('kudo')
@ApiTags('Kudo')
export class KudoController {
  constructor(private readonly kudoService: KudoService, private readonly kudoMapper: KudoMapper) { }

  @Post('create')
  @CreateKudoApi()
  async create(
    @UploadedFile() kudoImage: Express.Multer.File,
    @Body() createKudoDto: CreateKudoDto,
    @Res() res: Response
  ): Promise<void> {
    const createdKudo = await this.kudoService.create(KudoMapper.fromCreateKudoDto(createKudoDto), kudoImage);
    res.header('Location', `/kudo/${createdKudo.id}`).send();
  }

  @Get('getAll')
  async findAll(): Promise<KudoDto[]> {
    const kudos = await this.kudoService.getAllKudos();
    return Promise.all(kudos.map(async (e) => await this.kudoMapper.toKudoDto(e)));
  }
}
