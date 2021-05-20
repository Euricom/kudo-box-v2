import { KudoCardDto } from "src/models/kudo/api/dto/out/kudo-card.dto"

export class MyKudosDto {
    constructor(
        readonly receivedKudos: KudoCardDto[],
        readonly sentKudos: KudoCardDto[]
    ) {}
}