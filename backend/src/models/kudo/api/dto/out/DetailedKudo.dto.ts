import { EventDto } from "../../../../event/api/dto/out/Event.dto";
import { UserDto } from "../../../../user/api/dto/out/User.dto";

export class DetailedKudoDto {
    readonly sendDateTime: string;
    readonly sender: UserDto;
    readonly receiver?: UserDto;
    readonly event?: EventDto;
    readonly kudoImage: string;

    constructor(sendDateTime: string, sender: UserDto, kudoImage: string, receiver?: UserDto, event?: EventDto) {
        this.sendDateTime = sendDateTime;
        this.sender = sender;
        this.receiver = receiver;
        this.event = event;
        this.kudoImage = kudoImage;
    }
}