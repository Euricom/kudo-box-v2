import { BasicKudoDto } from "../../../../../models/kudo/api/dto/out/BasicKudo.dto";

export class MyKudosDto {
    readonly receivedKudos: BasicKudoDto[];
    readonly sentKudos: BasicKudoDto[];

    constructor(
        receivedKudos: BasicKudoDto[],
        sentKudos: BasicKudoDto[]
    ) {
        this.receivedKudos = receivedKudos;
        this.sentKudos = sentKudos;
    }
}