import { BasicKudoDto } from "src/models/kudo/api/dto/out/BasicKudo.dto";
import { EventRoomInfoDto } from "./EventRoomInfo.dto";

export class EventRoomDto {
    eventRoomInfo: EventRoomInfoDto;
    kudos?: BasicKudoDto[];

    constructor(eventRoomInfo: EventRoomInfoDto, kudos?: BasicKudoDto[]) {
        this.eventRoomInfo = eventRoomInfo;
        this.kudos = kudos;
    }
}