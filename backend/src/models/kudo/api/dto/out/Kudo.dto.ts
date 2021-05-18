export class KudoDto {
    readonly senderId: string;
    readonly receiverId: string;
    readonly eventId?: string;
    readonly kudoImage: string;

    constructor(senderId: string, kudoImage: string, receiverId: string, eventId?: string) {
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.kudoImage = kudoImage;
        this.eventId = eventId;
    }
}