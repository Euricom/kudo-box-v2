import { EntityRepository, Repository } from "typeorm";
import { Tag } from "../entities/tag.entity";

@EntityRepository(Tag)
export class TagRepository extends Repository<Tag> {
    async countByName(tagName: string): Promise<number> {
        return (await this.count({ where: { _name: tagName }}));
    }
}