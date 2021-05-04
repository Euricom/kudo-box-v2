import { Injectable } from '@nestjs/common';
import { TagRepository } from '../../data-access/tag.repository';
import { Tag } from '../../entities/tag.entity';

@Injectable()
export class TagService {
    constructor(
        private readonly tagRepo: TagRepository
    ) {}

    async tagNameExists(name: string): Promise<boolean> {
        const tags = await this.getAllTagsByName([name])
        if(tags.length === 0) return false;
        return true;
    }

    private getAllTagsByName(names: string[]): Promise<Tag[]> {
        return this.tagRepo.findTagsByNames(names);
    }
}
