export class BasicKudoDto {
    readonly Id: string;
    readonly receiver: string;
    readonly event?: string;
    readonly kudoImage: string;

    constructor(Id: string,kudoImage: string, receiver: string, event?: string) {
        this.Id = Id;
        this.receiver = receiver;
        this.kudoImage = kudoImage;
        this.event = event;
    }
}