import { User } from "src/models/user/entities/user.entity";
import { Event } from "../../entities/event.entity";
import { CreateEventDto } from "../dto/create-event/create-event.dto";

export class EventMapper {
    static fromCreateEventDto(dto: CreateEventDto): Event {
        const host = new User(dto.hostId, undefined, undefined, undefined)
        
        return new Event(undefined, dto.title, undefined, undefined, undefined, host);
    }
}