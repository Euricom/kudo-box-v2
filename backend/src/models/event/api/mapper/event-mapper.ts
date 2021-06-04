import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { Event } from "../../entities/event/event.entity";
import { CreateEventDto } from "../dto/in/create-event/create-event.dto";
import { ImageClientService } from "../../../../modules/image/service/image-client.service";
import { DropDownEventDto } from "../dto/out/DropDownEvent.dto";
import { EventDto } from "../dto/out/Event.dto";
import { EventTagDto } from "../dto/out/EventTag.dto";
import { InternalServerErrorException } from "@nestjs/common/exceptions";
import { EventRoomDto } from "../dto/out/EventRoom.dto";
import { EventRoomInfoDto } from "../dto/out/EventRoomInfo.dto";
import { KudoMapper } from "../../../kudo/api/mapper/kudo-mapper";

@Injectable()
export class EventMapper {
    constructor(
        @Inject(forwardRef(() => KudoMapper))private readonly kudoMapper: KudoMapper,
        private readonly imageService: ImageClientService,
    ) {

     }

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

    async toEventRoomDto(event: Event): Promise<EventRoomDto> {
        if(!event.kudos) throw new InternalServerErrorException('Kudos of event should be defined');

        const eventRoomInfo = this.toEventRoomInfoDto(event);
        // const basicKudoDtos = await Promise.all(event.kudos.map(k => this.kudoMapper.toBasicKudoDto(k)));

        return new EventRoomDto(eventRoomInfo, undefined);
    }

    private toEventRoomInfoDto(event: Event): EventRoomInfoDto {
        if(!event.ownedTag) throw new InternalServerErrorException('OwnedTag of event should be defined');
        if(!event.host) throw new InternalServerErrorException('Host of event should be defined');

        return new EventRoomInfoDto(event.title!, event.ownedTag.name!, event.host.firstname!, event.host.lastname!);
    }
}