export class CreateKudoDto {
    constructor(
        private readonly _senderId: string,
        private readonly _receiverId: string,
    ) {}

    public get senderId() {
        return this._senderId
    }

    public get receiverId() {
        return this._receiverId;
    }
}
