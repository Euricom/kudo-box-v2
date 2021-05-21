export class BasicKudoDto {
    readonly id: string;
    readonly kudoImage: string;

    constructor(id: string, kudoImage: string) {
        this.id = id;
        this.kudoImage = kudoImage;
    }
}