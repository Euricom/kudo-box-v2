export class CreateKudoDto {
    private readonly senderId: string;
    private readonly receiverId: string;

    constructor(senderId: string, receiverId: string) {
        this.senderId = senderId;
        this.receiverId = receiverId;
    }

    public get getSenderId() {
        return this.senderId;
    }

    public get getReceiverId() {
        return this.receiverId;
    }
}
