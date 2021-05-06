import { EntityRepository, Repository } from "typeorm";
import { Event } from "../entities/event.entity";
import { Tag } from "../entities/tag.entity";

@EntityRepository(Event)
export class EventRepository extends Repository<Event> {
}