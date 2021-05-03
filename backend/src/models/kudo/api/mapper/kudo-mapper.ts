import { Kudo } from "../../entities/kudo.entity";
import { CreateKudoDto } from "../dto/create-kudo.dto";

export class KudoMapper {
    static fromCreateKudoDto(kudoDto: CreateKudoDto): Kudo {
        return new Kudo(kudoDto.senderId, kudoDto.receiverId)
    }
}