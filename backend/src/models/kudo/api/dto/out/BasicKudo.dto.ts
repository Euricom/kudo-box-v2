export class BasicKudoDto {
    readonly Id: string;
    readonly kudoImage: string;

    constructor(Id: string, kudoImage: string) {
        this.Id = Id;
        this.kudoImage = kudoImage;
    }
}