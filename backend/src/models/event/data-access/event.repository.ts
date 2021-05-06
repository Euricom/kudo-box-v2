import { EntityRepository, Repository } from "typeorm";
import { Event } from "../entities/event.entity";
import { Tag } from "../entities/tag.entity";

@EntityRepository(Event)
export class EventRepository extends Repository<Event> {
  async findByIdIncludingTags(id: string): Promise<Event | undefined> {
    return this.createQueryBuilder('event')
        .innerJoinAndSelect('event.tags', 'tag')
        .where('event.id = :eventId', { eventId: id })
        .getOne();
  }
}