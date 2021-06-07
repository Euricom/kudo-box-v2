import { EntityRepository, Like, Repository } from "typeorm";
import { Event } from "../../entities/event/event.entity";

@EntityRepository(Event)
export class EventRepository extends Repository<Event> {

  findFeaturedEvents(): Promise<Event[]> {
    return this.createQueryBuilder('event')
      .innerJoinAndSelect('event.ownedTag', 'ownedTag')
      .where('event.active = 1')
      .getMany();
  }
  findEvents(): Promise<Event[]> {
    return this.createQueryBuilder('event')
      .innerJoinAndSelect('event.ownedTag', 'ownedTag')
      .orderBy("event.creationDate", "DESC")
      .getMany();
  }

  findEventsFiltered(filter: string): Promise<Event[]> {
    return this.createQueryBuilder('event')
      .innerJoinAndSelect('event.ownedTag', 'ownedTag')
      .where('UPPER(event.title) like UPPER(:filter)', { filter: `%${filter}%` })
      .orWhere('UPPER(ownedTag.name) like UPPER(:filter)', { filter: `%${filter}%` })
      .orderBy("event.creationDate", "DESC")
      .getMany();
  }

  findByIdIncludingTags(id: string): Promise<Event | undefined> {
    return this.createQueryBuilder('event')
      .innerJoinAndSelect('event.ownedTag', 'tag')
      .where('event.id = :eventId', { eventId: id })
      .getOne();
  }

  findById(id: string): Promise<Event | undefined> {
    return this.createQueryBuilder('event')
      .where('event.id = :eventId', { eventId: id })
      .getOne();
  }

  updateEvent(eventId: string, event: Event) {
    return this.createQueryBuilder('event')
      .update(event)
      .set({ active: event.active })
      .where('event.id = :eventId', { eventId: eventId })
      .execute();
  }

  findMainEvents(): Promise<Event[]> {
    return this.find({ where: { isMainEvent: true } });
  }

  filterByTitleAndTagName(tagOrEventFilterValue: string): Promise<Event[]> {
    return this.createQueryBuilder('event')
      .innerJoinAndSelect('event.ownedTag', 'ownedTag')
      .where('UPPER(event.title) like UPPER(:eventTitle)', { eventTitle: `%${tagOrEventFilterValue}%` })
      .orWhere('UPPER(ownedTag.name) like UPPER(:tagName)', { tagName: `%${tagOrEventFilterValue}%` })
      .getMany();
  }
}