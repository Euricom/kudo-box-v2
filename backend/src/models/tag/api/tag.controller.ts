import { Controller, Get } from '@nestjs/common';
import { TagService } from '../service/tag.service';
import { TagEvent } from './dto/TagEvent';
import { TagMapper } from './mapper/tag-mapper';

@Controller('tag')
export class TagController {
    constructor(
        private readonly tagService: TagService
    ) {}

    @Get('/with-owner-event')
    async getTagsWithOwnerEventBasic(): Promise<TagEvent[]> {
        const tags = await this.tagService.getTagsWithOwnerEvent();
        return tags.map(t => TagMapper.toTagEvent(t));
    }
}
