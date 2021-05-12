import { EntityRepository, Like, Repository } from "typeorm";
import { Event } from "../../entities/event/event.entity";

@EntityRepository(Event)
export class EventRepository extends Repository<Event> {
  async findByIdIncludingTags(id: string): Promise<Event | undefined> {
    return this.createQueryBuilder('event')
        .innerJoinAndSelect('event.ownedTag', 'tag')
        .where('event.id = :eventId', { eventId: id })
        .getOne();
  }

  async findMainEvents(): Promise<Event[]> {
    return this.find({ where: {isMainEvent: true} });
  }

  filterByTitleAndTagName(tagOrEventFilterValue: string): Promise<Event[]> {
    return this.createQueryBuilder('event')
      .innerJoinAndSelect('event.ownedTag', 'ownedTag')
      .where('UPPER(event.title) like UPPER(:eventTitle)', {eventTitle: `%${tagOrEventFilterValue}%`})
      .orWhere('UPPER(ownedTag.name) like UPPER(:tagName)', {tagName: `%${tagOrEventFilterValue}%`})
      .getMany();
  }
}