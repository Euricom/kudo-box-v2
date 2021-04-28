import { IsNumber } from "class-validator";

export class CreateKudoDto {
    readonly senderId: string;
    readonly receiverId: string;

    constructor(senderId: string, receiverId: string) {
        this.senderId = senderId;
        this.receiverId = receiverId;
    }
}
