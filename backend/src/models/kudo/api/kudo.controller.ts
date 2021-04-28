import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, HttpStatus, HttpCode, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { Kudo } from '../entities/kudo.entity';
import { KudoService } from '../service/kudo.service';
import { CreateKudoDto } from './dto/create-kudo.dto';
import { UpdateKudoDto } from './dto/update-kudo.dto';

@Controller('kudo')
export class KudoController {
  constructor(private readonly kudoService: KudoService) {}

  @Post('create')
  @UseInterceptors(FileInterceptor('kudoImage'))
  @HttpCode(HttpStatus.CREATED)
  async create(
      @UploadedFile() kudoImage: Express.Multer.File,
      @Body() createKudoDto: CreateKudoDto,
    ) {
    const createdKudo = await this.kudoService.create(Kudo.fromCreateKudoDto(createKudoDto), kudoImage);
    return `/kudo/${createdKudo.id}`;
  }

  @Get()
  findAll() {
    return this.kudoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.kudoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateKudoDto: UpdateKudoDto) {
    // return this.kudoService.update(id, updateKudoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.kudoService.remove(id);
  }
}
