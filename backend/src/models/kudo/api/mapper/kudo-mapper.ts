import { Injectable } from "@nestjs/common";
import { InternalServerErrorException } from "@nestjs/common/exceptions";
import { ImageClientService } from "../../../../modules/image/service/image-client.service";
import { Event } from "../../../event/entities/event/event.entity";
import { User } from "../../../user/entities/user.entity";
import { Kudo } from "../../entities/kudo.entity";
import { CreateKudoDto } from "../dto/in/create-kudo.dto";
import { KudoDto } from "../dto/out/Kudo.dto";

@Injectable()
export class KudoMapper {

    constructor(private readonly imageService: ImageClientService) {}

    static fromCreateKudoDto(kudoDto: CreateKudoDto): Kudo {
        const sender = new User(kudoDto.senderId);

        let receiver: User | undefined;
        if (kudoDto.receiverId) receiver = new User(kudoDto.receiverId);

        let event: Event | undefined;
        if (kudoDto.eventId) event = new Event(kudoDto.eventId);

        const kudo = new Kudo(undefined, undefined, event, sender, receiver);

        sender.sentKudos = [kudo];

        if (receiver) receiver.receivedKudos = [kudo];

        return kudo;
    }

    async toKudoDto(kudo: Kudo): Promise<KudoDto> {
        if (!kudo.sender || !kudo.sender!.id) throw new InternalServerErrorException(null, 'Something went wrong getting your kudo');
        if (!kudo.receiver || !kudo.receiver!.id) throw new InternalServerErrorException(null, 'Something went wrong getting your kudo');
        if (!kudo.imageUrl) throw new InternalServerErrorException(null, 'Something went wrong getting your kudo');
        return new KudoDto(kudo.sender.id, await this.imageService.getImage(kudo.imageUrl), kudo.receiver?.id, kudo.event?.id)
    }
}