import { EntityRepository, Repository } from "typeorm";
import { Tag } from "../../entities/tag/tag.entity";

@EntityRepository(Tag)
export class TagRepository extends Repository<Tag> {
    countByName(tagName: string): Promise<number> {
        return this.count({ where: { name: tagName }});
    }

    findAllWithOwnerEvent(): Promise<Tag[]> {
        return this.find({ relations: ['ownerEvent'] })
    }
}