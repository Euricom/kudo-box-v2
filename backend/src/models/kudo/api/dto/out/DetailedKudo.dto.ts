import { EventDto } from "../../../../event/api/dto/out/Event.dto";
import { UserDto } from "../../../../user/api/dto/out/User.dto";

export class DetailedKudoDto {
    readonly sendDateTime: Date;
    readonly sender: UserDto;
    readonly receiver: UserDto;
    readonly event?: EventDto;
    readonly kudoImage: string;

    constructor(sendDateTime: Date, sender: UserDto, receiver: UserDto, kudoImage: string, event?: EventDto) {
        this.sendDateTime = sendDateTime;
        this.sender = sender;
        this.receiver = receiver;
        this.event = event;
        this.kudoImage = kudoImage;
    }
}