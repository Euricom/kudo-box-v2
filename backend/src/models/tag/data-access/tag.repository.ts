import { throws } from "node:assert";
import { Connection, EntityRepository, Repository } from "typeorm";
import { Event } from "../../event/entities/event.entity";
import { Tag } from "../entities/tag.entity";

@EntityRepository(Tag)
export class TagRepository extends Repository<Tag> {

    countByName(tagName: string): Promise<number> {
        return this.count({ where: { name: tagName }});
    }
}