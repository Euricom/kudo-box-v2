import { Injectable } from '@nestjs/common';
import { TagRepository } from '../../data-access/tag.repository';

@Injectable()
export class TagService {
    constructor(
        private readonly tagRepo: TagRepository
    ) {}

    async tagNameExists(name: string): Promise<boolean> {
        return (await this.tagRepo.countByName(name)) !== 0;
    }

    getTagsOfEvents(mainEventIds: string[]) {
        return this.tagRepo.getTagsByEvent(mainEventIds);
    }
}
