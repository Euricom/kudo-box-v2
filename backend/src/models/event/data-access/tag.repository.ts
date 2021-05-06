import { throws } from "node:assert";
import { Connection, EntityRepository, Repository } from "typeorm";
import { Event } from "../entities/event.entity";
import { Tag } from "../entities/tag.entity";

@EntityRepository(Tag)
export class TagRepository extends Repository<Tag> {
    constructor(private readonly connection: Connection) {
        super();
    }

    countByName(tagName: string): Promise<number> {
        return this.count({ where: { name: tagName }});
    }

    getTagsByEvent(mainEventIds: string[]): Promise<Tag[]> {
        return this.connection.createQueryBuilder(Tag, 'tag')
            .innerJoin('tag.events', 'event')
            .where('event.id IN (:...eventIds)', { eventIds: mainEventIds } )
            .getMany();
    }
}