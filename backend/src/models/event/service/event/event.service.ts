import { BadRequestException, Injectable } from '@nestjs/common';
import { Event } from '../../entities/event.entity';
import { TagService } from '../tag/tag.service';

@Injectable()
export class EventService {
  constructor(
    private readonly tagService: TagService
  ) {}

  create(event: Event, eventImage: Express.Multer.File): Event {
    const generatedTag = event.generateTag();
    if(!generatedTag) throw new BadRequestException(null, 'Eventname is required');
    if(this.tagService.tagNameExists(generatedTag.name)) this.tagService.makeTagNameUnique(generatedTag)
  }

  findAll() {
    return `This action returns all event`;
  }

  findOne(id: number) {
    return `This action returns a #${id} event`;
  }

  update(id: number, event: Event) {
    return `This action updates a #${id} event`;
  }

  remove(id: number) {
    return `This action removes a #${id} event`;
  }
}
