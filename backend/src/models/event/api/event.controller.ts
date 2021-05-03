import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, UploadedFile } from '@nestjs/common';
import { EventService } from '../service/event.service';
import { CreateEventDto } from './dto/create-event/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { CreateEventApi } from './decorator/event-endpoint.decorator';
import { fromCreateEventDto } from './mapper/event-mapper';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post('create')
  @CreateEventApi()
  create(
    @UploadedFile() eventImage: Express.Multer.File,
    @Body() createEventDto: CreateEventDto,
    @Res() res: Response
  ) {
    return this.eventService.create(fromCreateEventDto(createEventDto));
  }

  @Get()
  findAll() {
    return this.eventService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    // return this.eventService.update(+id, updateEventDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventService.remove(+id);
  }
}
