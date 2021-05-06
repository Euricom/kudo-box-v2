import { Controller, Post, Body, Res, UploadedFile, Get } from '@nestjs/common';
import { EventService } from '../service/event/event.service';
import { CreateEventDto } from './dto/create-event/create-event.dto';
import { CreateEventApi } from './decorator/event-endpoint.decorator';
import { EventMapper } from './mapper/event-mapper';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { TagRepository } from '../data-access/tag.repository';

@Controller('event')
@ApiTags('Event')
export class EventController {
  constructor(private readonly eventService: EventService, private readonly tagRepo: TagRepository) {}

  @Post('create')
  @CreateEventApi()
  async create(
    @UploadedFile() eventImage: Express.Multer.File,
    @Body() createEventDto: CreateEventDto,
    @Res() res: Response
  ) {
    const createdEvent = await this.eventService.create(EventMapper.fromCreateEventDto(createEventDto), eventImage, createEventDto.newTagName, createEventDto.mainEventIds);
    res.header('Location', `/event/${createdEvent.id}`).send();
  }

  @Get('test')
  async test() {
    return this.tagRepo.getTagsByEvent([]);
  }
}
