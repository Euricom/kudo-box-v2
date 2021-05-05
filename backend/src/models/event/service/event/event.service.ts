import { BadRequestException, Injectable, NotImplementedException } from '@nestjs/common';
import { ImageClientService } from '../../../../modules/image/service/image-client.service';
import { ImageEntityService } from '../../../utils/image-entity.service';
import { EventRepository } from '../../data-access/event.repository';
import { Event } from '../../entities/event.entity';
import { Tag } from '../../entities/tag.entity';
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

  async create(event: Event, eventImage: Express.Multer.File, tagName: string, mainEventIds?: string[]): Promise<Event> {
    if (!this.tagService.tagNameExists(tagName)) throw new BadRequestException(null, 'Given tag already exists');
    if(mainEventIds) event.tags = await this.tagService.getTagsOfEvents(mainEventIds)

    event.createTag(tagName);
    return super.createImageEntity(event, eventImage);
  }
}
