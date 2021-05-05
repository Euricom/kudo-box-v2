import { EntityRepository, Repository } from "typeorm";
import { Tag } from "../entities/tag.entity";

@EntityRepository(Tag)
export class TagRepository extends Repository<Tag> {
    async tagNameExists(name: string): Promise<boolean> {
        return (await this.count({ where: { name } })) !== 0;
    }

    findTagsByNames(names: string[]): Promise<Tag[]> {
        const nameOrFilters = names.map(n => { name: n });
        return this.find({ where: nameOrFilters });
    }
}