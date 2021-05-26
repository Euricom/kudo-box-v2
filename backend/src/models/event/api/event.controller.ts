import { Controller, Post, Body, Res, UploadedFile, Get, Query } from '@nestjs/common';
import { EventService } from '../service/event/event.service';
import { CreateEventDto } from './dto/in/create-event/create-event.dto';
import { CreateEventApi } from './decorator/event-endpoint.decorator';
import { EventMapper } from './mapper/event-mapper';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { DropDownEventDto } from './dto/out/DropDownEvent.dto';
import { EventTagDto } from './dto/out/EventTag.dto';
import { ApiDefaultControllerDoc } from '../../../models/utils/api/swagger/api-default-controller-doc.decorator';
import { EventDto } from './dto/out/Event.dto';

@Controller('event')
@ApiDefaultControllerDoc('Event')
export class EventController {
  constructor(private readonly eventService: EventService, private readonly eventmapper: EventMapper) {}

  @Post('create')
  @CreateEventApi()
  async create(
    @UploadedFile() eventImage: Express.Multer.File,
    @Body() createEventDto: CreateEventDto,
    @Res() res: Response
  ) {
    const createdEvent = await this.eventService.create(EventMapper.fromCreateEventDto(createEventDto), eventImage, createEventDto.newTagName, createEventDto.mainEventId);
    res.header('Location', `/event/${createdEvent.id}`).send();
  }

  @Get('main/basic')
  async findEvents(): Promise<DropDownEventDto[]> {
    const mainEvents = await this.eventService.getMainEvents();
    return mainEvents.map(e => EventMapper.toDropDownEventDto(e));
  }

  @Get('with-owned-tag')
  async findEventsWithOwnedTag(
    @Query('event-name') eventName: string,
  ): Promise<EventTagDto[]> {
    const events = await this.eventService.getByNameIncludingOwnedTag(eventName);
    return events.map(e => EventMapper.toTagEvent(e));
  }

  @Get('getAll')
  async findAll(): Promise<EventDto[]> {
    const events = await this.eventService.getAllEvents();
    return Promise.all(events.map(async (e) => await this.eventmapper.toEventDto(e)));
  }

  @Get('getFeatured')
  async findFeatured(): Promise<EventDto[]> {
    const events = await this.eventService.getFeaturedEvents();
    return Promise.all(events.map(async (e) => await this.eventmapper.toEventDto(e)));
  }
}
