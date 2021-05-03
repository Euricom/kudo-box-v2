import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, HttpStatus, HttpCode, Res, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiInternalServerErrorResponse, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { KudoService } from '../service/kudo.service';
import { CreateKudoDto } from './dto/create-kudo.dto';
import { UpdateKudoDto } from './dto/update-kudo.dto';
import { KudoMapper } from './mapper/kudo-mapper';

@Controller('kudo')
export class KudoController {
  constructor(private readonly kudoService: KudoService) {}

  @Post('create')
  @UseInterceptors(FileInterceptor('kudoImage', {limits: {fileSize: parseInt(process.env.IMAGE_MAX_SIZE)}}))
  @HttpCode(HttpStatus.CREATED)
  @ApiInternalServerErrorResponse({description: 'internal server error'})
  @ApiResponse({headers: {Location: {description: 'location to fetch created kudo'}}})
  @ApiConsumes('multipart/form-data')
  async create(
      @UploadedFile() kudoImage: Express.Multer.File,
      @Body() createKudoDto: CreateKudoDto,
      @Res() res: Response
    ) {
      const createdKudo = await this.kudoService.create(KudoMapper.fromCreateKudoDto(createKudoDto), kudoImage);
      res.header('Location', `/kudo/${createdKudo.id}`).send();
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
