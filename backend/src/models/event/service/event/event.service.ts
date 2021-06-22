import { BadRequestException, forwardRef, Inject, Injectable, NotImplementedException } from '@nestjs/common';
import { UserService } from '../../../user/service/user.service';
import { ImageClientService } from '../../../../modules/image/service/image-client.service';
import { ImageEntityService } from '../../../utils/image-entity.service';
import { EventRepository } from '../../data-access/event/event.repository';
import { Event } from '../../entities/event/event.entity';
import { TagService } from '../tag/tag.service';
import { KudoService } from '../../../../models/kudo/service/kudo.service';

@Injectable()
export class EventService extends ImageEntityService<Event> {
  constructor(
    private readonly tagService: TagService,
    private readonly userService: UserService,
    private readonly eventRepo: EventRepository,
    @Inject(forwardRef(() => KudoService)) private readonly kudoService: KudoService,
    imageClient: ImageClientService,
  ) {
    super(imageClient, eventRepo);
  }

  async getFeaturedEvents(): Promise<Event[]> {
    return await (this.repo as EventRepository).findFeaturedEvents();
  }

  async getAllEvents(filter?: string): Promise<Event[]> {
    if (filter) return (this.repo as EventRepository).findEventsFiltered(filter);
    return await (this.repo as EventRepository).findEvents();
  }

  async create(event: Event, hostId: string, eventImage: Express.Multer.File, tagName: string, mainEventId?: string): Promise<Event> {
    const tagNameExists = await this.tagService.tagNameExists(tagName)
    if (tagNameExists) throw new BadRequestException(null, 'Given tag already exists');
    if (mainEventId) await this.assignMainEvent(event, mainEventId);

    this.assignHost(event, hostId);
    event.createTag(tagName);

    return await this.createImageEntity(event, eventImage);
  }

  async getMainEvents(): Promise<Event[]> {
    return await (this.repo as EventRepository).findMainEvents();
  }

  async getByNameIncludingOwnedTag(eventName: string): Promise<Event[]> {
    return (await (this.repo as EventRepository).filterByTitleAndTagName(eventName));
  }

  getEventWithHostAndKudos(eventId: string): Promise<Event | undefined> {
    return this.eventRepo.findEventByIdWithHostAndKudos(eventId);
}

  async eventExists(id: string): Promise<boolean> {
    return !!(await (this.repo as EventRepository).count({ where: { id } }));
  }

  async getEventById(id: string): Promise<Event | undefined> {
    return await (this.repo as EventRepository).findById(id);
  }

  getKudosOfEvent(eventId: string) {
    return this.kudoService.getKudosOfEvent(eventId);
  }

  async toggleActive(eventId: string) {
    const event = await this.getEventById(eventId);
    if (event) {
      event.toggleActive();
      await (this.repo as EventRepository).updateEvent(eventId, event);
    }
  }

  private async assignMainEvent(childEvent: Event, mainEventId: string): Promise<void> {
    const mainEvent = await (this.repo as EventRepository).findByIdIncludingTags(mainEventId);
    if (!mainEvent) throw new BadRequestException(null, `Main event with id ${mainEventId} not found`);

    childEvent.assignMainEvent(mainEvent);
  }

  private async assignHost(event: Event, hostId: string) {
    const host = await this.userService.getUser(hostId);
    if (!host) throw new BadRequestException(`Host with id ${hostId} not found`);

    event.assignHost(host);
  }
}
