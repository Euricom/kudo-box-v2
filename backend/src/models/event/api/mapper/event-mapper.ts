import { User } from "../../../user/entities/user.entity";
import { Event } from "../../entities/event/event.entity";
import { CreateEventDto } from "../dto/in/create-event/create-event.dto";
import { DropDownEventDto } from "../dto/out/DropDownEvent.dto";

export class EventMapper {
    static fromCreateEventDto(dto: CreateEventDto): Event {
        const host = new User(dto.hostId, undefined, undefined, undefined)
        return new Event(undefined, dto.title, dto.isMainEvent.toLowerCase() === 'true', undefined, undefined, undefined, host);
    }

    static toDropDownEventDto(event: Event): DropDownEventDto {
        return new DropDownEventDto(event.id!, event.title!)
    }
}