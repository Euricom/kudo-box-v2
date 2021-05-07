import { BadRequestException, Injectable, NotImplementedException } from '@nestjs/common';
import { ImageClientService } from '../../../../modules/image/service/image-client.service';
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

  async create(event: Event, eventImage: Express.Multer.File, tagName: string, mainEventId?: string): Promise<Event> {
    if (await this.tagService.tagNameExists(tagName)) throw new BadRequestException(null, 'Given tag already exists');
    if (mainEventId) await this.assignMainEvent(event, mainEventId);
    
    event.createTag(tagName);
    return await super.createImageEntity(event, eventImage);
  }

  private async assignMainEvent(childEvent: Event, mainEventId: string): Promise<void> {
    const mainEvent = await this.eventRepo.findByIdIncludingTags(mainEventId);
    if(!mainEvent) throw new BadRequestException(null, `Main event with id ${mainEventId} not found`);

    childEvent.assignMainEvent(mainEvent);
  }
}
