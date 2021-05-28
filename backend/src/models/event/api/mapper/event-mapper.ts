import { Injectable } from "@nestjs/common";
import { Event } from "../../entities/event/event.entity";
import { CreateEventDto } from "../dto/in/create-event/create-event.dto";
import { ImageClientService } from "../../../../modules/image/service/image-client.service";
import { DropDownEventDto } from "../dto/out/DropDownEvent.dto";
import { EventDto } from "../dto/out/Event.dto";
import { EventTagDto } from "../dto/out/EventTag.dto";
import { InternalServerErrorException } from "@nestjs/common/exceptions";

@Injectable()
export class EventMapper {
    constructor(private readonly imageService: ImageClientService) { }
    static fromCreateEventDto(dto: CreateEventDto): Event {
        return new Event(undefined, dto.title, dto.isMainEvent.toLowerCase() === 'true', new Date());
    }

    static toDropDownEventDto(event: Event): DropDownEventDto {
        if (!event.id) throw new InternalServerErrorException(null, 'Something went wrong getting your event');
        if (!event.title) throw new InternalServerErrorException(null, 'Something went wrong getting your event');
        
        return new DropDownEventDto(event.id, event.title)
    }

    static toTagEvent(event: Event): EventTagDto {
        if (!event.id) throw new InternalServerErrorException(null, 'Something went wrong getting your event');
        if (!event.title) throw new InternalServerErrorException(null, 'Something went wrong getting your event');
        if (!event.ownedTag || !event.ownedTag!.name) throw new InternalServerErrorException(null, 'Something went wrong getting your event');

        return new EventTagDto(event.id, event.title, event.ownedTag?.name);
    }

    async toEventDto(event: Event): Promise<EventDto> {
        if (!event.id) throw new InternalServerErrorException(null, 'Something went wrong getting your event');
        if (!event.title) throw new InternalServerErrorException(null, 'Something went wrong getting your event');
        if (event.isMainEvent === undefined) throw new InternalServerErrorException(null, 'Something went wrong getting your event');
        if (!event.creationDate) throw new InternalServerErrorException(null, 'Something went wrong getting your event');
        if (!event.imageUrl) throw new InternalServerErrorException(null, 'Something went wrong getting your event');
        if (!event.ownedTag || !event.ownedTag!.name) throw new InternalServerErrorException(null, 'Something went wrong getting your event');

        return new EventDto(event.id, event.title, event.isMainEvent, event.creationDate.toLocaleDateString('en-EN'), await this.imageService.getImage(event.imageUrl), event.ownedTag?.name);
    }
}