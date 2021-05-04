import { User } from "../../../user/entities/user.entity";
import { Kudo } from "../../entities/kudo.entity";
import { CreateKudoDto } from "../dto/create-kudo.dto";

export class KudoMapper {
    static fromCreateKudoDto(kudoDto: CreateKudoDto): Kudo {
        const sender = new User(kudoDto.senderId);
        const receiver = new User(kudoDto.receiverId);

        return new Kudo(undefined, undefined, undefined, sender, receiver);
    }
}