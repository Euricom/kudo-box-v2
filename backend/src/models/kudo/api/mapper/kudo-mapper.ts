import { Event } from "../../../event/entities/event/event.entity";
import { User } from "../../../user/entities/user.entity";
import { Kudo } from "../../entities/kudo.entity";
import { CreateKudoDto } from "../dto/create-kudo.dto";

export class KudoMapper {
    static fromCreateKudoDto(kudoDto: CreateKudoDto): Kudo {
        const sender = new User(kudoDto.senderId);

        let receiver: User | undefined;
        if(kudoDto.receiverId) receiver = new User(kudoDto.receiverId);
        
        let event: Event | undefined;
        if(kudoDto.eventId) event = new Event(kudoDto.eventId);

        const kudo = new Kudo(undefined, undefined, event, sender, receiver);

        sender.sentKudos = [kudo];

        if(receiver) receiver.receivedKudos = [kudo];
        
        return kudo;
    }
}