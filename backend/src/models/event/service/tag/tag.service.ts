import { Injectable } from '@nestjs/common';
import { TagRepository } from '../../data-access/tag/tag.repository';
import { Tag } from '../../entities/tag/tag.entity';

@Injectable()
export class TagService {
    
    constructor(
        private readonly tagRepo: TagRepository
    ) {}

    async tagNameExists(name: string): Promise<boolean> {
        return !!(await this.tagRepo.countByName(name));
    }

    async getTagsWithOwnerEvent(): Promise<Tag[]> {
        return this.tagRepo.findAllWithOwnerEvent();
    }
}
