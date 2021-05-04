import { User } from "src/models/user/entities/user.entity";
import { Event } from "../../entities/event.entity";
import { Tag } from "../../entities/tag.entity";
import { CreateEventDto } from "../dto/create-event/create-event.dto";

export class EventMapper {
    static fromCreateEventDto(dto: CreateEventDto): Event {
        const tags = dto.tagIds.map((tId) => new Tag(tId));
        const host = new User(dto.hostId);

        return new Event(null, dto.title, dto.isMainEvent, tags, host)
    }
}