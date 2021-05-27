import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UploadedFile, BadRequestException, Request, Query } from '@nestjs/common';
import { Response } from 'express';
import { KudoService } from '../service/kudo.service';
import { CreateKudoApi } from './decorator/kudo-endpoint.decorator';
import { CreateKudoDto } from './dto/in/create-kudo.dto';
import { KudoMapper } from './mapper/kudo-mapper';
import { BasicKudoDto } from './dto/out/BasicKudo.dto';
import { DetailedKudoDto } from './dto/out/DetailedKudo.dto';
import { ApiDefaultControllerDoc } from '../../utils/api/swagger/api-default-controller-doc.decorator';
import { RequestWithUser } from '../../utils/api/request-with-user';

@Controller('kudo')
@ApiDefaultControllerDoc('Kudo')
export class KudoController {
  constructor(private readonly kudoService: KudoService, private readonly kudoMapper: KudoMapper) { }

  @Post('create')
  @CreateKudoApi()
  async create(
    @UploadedFile() kudoImage: Express.Multer.File,
    @Body() createKudoDto: CreateKudoDto,
    @Request() req: RequestWithUser,
    @Res() res: Response
  ): Promise<void> {
    const createdKudo = await this.kudoService.create(KudoMapper.fromCreateKudoDto(createKudoDto, req.user), kudoImage);
    res.header('Location', `/kudo/${createdKudo.id}`).send();
  }

  @Get('getAll')
  async findAll(
    @Query('filter') filter?: string
  ): Promise<BasicKudoDto[]> {
    const kudos = await this.kudoService.getKudos(filter);
    return Promise.all(kudos.map(async (e) => await this.kudoMapper.toBasicKudoDto(e)));
  }

  @Get('getOne/:id')
  async findKudo(@Param('id') id: string): Promise<DetailedKudoDto> {
    const kudo = await this.kudoService.getKudo(id);
    return await this.kudoMapper.toDetailedKudoDto(kudo);
  }
}
