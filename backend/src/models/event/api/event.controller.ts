import { Controller, Post, Body, Res, UploadedFile } from '@nestjs/common';
import { EventService } from '../service/event/event.service';
import { CreateEventDto } from './dto/create-event/create-event.dto';
import { CreateEventApi } from './decorator/event-endpoint.decorator';
import { EventMapper } from './mapper/event-mapper';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@Controller('event')
@ApiTags('Event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post('create')
  @CreateEventApi()
  async create(
    @UploadedFile() eventImage: Express.Multer.File,
    @Body() createEventDto: CreateEventDto,
    @Res() res: Response
  ) {
    const createdEvent = await this.eventService.create(EventMapper.fromCreateEventDto(createEventDto), eventImage);
    res.header('Location', `/event/${createdEvent.id}`).send();
  }
}
