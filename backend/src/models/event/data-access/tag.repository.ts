import { throws } from "node:assert";
import { Connection, EntityRepository, Repository } from "typeorm";
import { Event } from "../entities/event/event.entity";
import { Tag } from "../entities/tag/tag.entity";

@EntityRepository(Tag)
export class TagRepository extends Repository<Tag> {

    countByName(tagName: string): Promise<number> {
        return this.count({ where: { name: tagName }});
    }
}