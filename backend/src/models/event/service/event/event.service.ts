import { BadRequestException, Injectable, NotImplementedException } from '@nestjs/common';
import { ImageClientService } from '../../../kudo/service/image-client.service';
import { ImageEntityService } from '../../../utils/image-entity.service';
import { EventRepository } from '../../data-access/event.repository';
import { Event } from '../../entities/event.entity';
import { TagService } from '../tag/tag.service';

@Injectable()
export class EventService extends ImageEntityService<Event> {
  constructor(
    private readonly tagService: TagService,
    private readonly eventRepo: EventRepository,
    imageClient: ImageClientService
  ) {
    super(imageClient, eventRepo);
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
