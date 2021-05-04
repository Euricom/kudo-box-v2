import { Injectable } from '@nestjs/common';
import { TagRepository } from '../../data-access/tag.repository';
import { Tag } from '../../entities/tag.entity';

@Injectable()
export class TagService {
    constructor(
        private readonly tagRepo: TagRepository
    ) {}

    async tagNamesExists(tagsToCheck: Tag[]): Promise<boolean> {
        const tags = await this.getAllTagsByName(tagsToCheck.map(t => t.name))
        if(tags.length === 0) return false;
        return true;
    }

    private getAllTagsByName(names: string[]): Promise<Tag[]> {
        return this.tagRepo.findTagsByNames(names);
    }
}
