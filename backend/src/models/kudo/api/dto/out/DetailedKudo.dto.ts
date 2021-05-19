import { Event } from "src/models/event/entities/event/event.entity";
import { User } from "src/models/user/entities/user.entity";

export class DetailedKudoDto {
    readonly sendDateTime: Date;
    readonly sender: User;
    readonly receiver: User;
    readonly event?: Event;
    readonly kudoImage: string;

    constructor(sendDateTime: Date, sender: User, receiver: User, kudoImage: string, event?: Event) {
        this.sendDateTime = sendDateTime;
        this.sender = sender;
        this.receiver = receiver;
        this.event = event;
        this.kudoImage = kudoImage;
    }
}