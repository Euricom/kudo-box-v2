import { Injectable } from '@nestjs/common';
import { TagRepository } from '../../data-access/tag.repository';
import { Tag } from '../../entities/tag.entity';

@Injectable()
export class TagService {
    
    constructor(
        private readonly tagRepo: TagRepository
    ) {}

    create(newTag: Tag): Promise<Tag> {
        return this.tagRepo.save(newTag);
      }

    async tagNameExists(name: string): Promise<boolean> {
        return (await this.tagRepo.countByName(name)) !== 0;
    }

    getTagsOfEvents(mainEventIds: string[]) {
        return this.tagRepo.getTagsByEvent(mainEventIds);
    }
}
