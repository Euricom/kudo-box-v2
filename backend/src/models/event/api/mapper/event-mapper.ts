import { User } from "src/models/user/entities/user.entity";
import { Event } from "../../entities/event.entity";
import { Tag } from "../../entities/tag.entity";
import { CreateEventDto } from "../dto/create-event/create-event.dto";

export function fromCreateEventDto(dto: CreateEventDto): Event {
    const tags = dto.tags.map((t) => new Tag(t.id, t.name));
    const host = new User(dto.hostId);

    return new Event(null, dto.title, dto.isMainEvent, tags, host)
}