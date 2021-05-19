import { Injectable } from "@nestjs/common";
import { InternalServerErrorException } from "@nestjs/common/exceptions";
import { ImageClientService } from "../../../../modules/image/service/image-client.service";
import { Event } from "../../../event/entities/event/event.entity";
import { User } from "../../../user/entities/user.entity";
import { Kudo } from "../../entities/kudo.entity";
import { CreateKudoDto } from "../dto/in/create-kudo.dto";
import { BasicKudoDto } from "../dto/out/BasicKudo.dto";
import { DetailedKudoDto } from "../dto/out/DetailedKudo.dto";

@Injectable()
export class KudoMapper {
    constructor(private readonly imageService: ImageClientService) { }

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

    async toBasicKudoDto(kudo: Kudo): Promise<BasicKudoDto> {
        if (!kudo.id) throw new InternalServerErrorException(null, 'Something went wrong getting your kudo');
        if (!kudo.receiver || !kudo.receiver!.name) throw new InternalServerErrorException(null, 'Something went wrong getting your kudo');
        if (!kudo.imageUrl) throw new InternalServerErrorException(null, 'Something went wrong getting your kudo');
        return new BasicKudoDto(kudo.id, await this.imageService.getImage(kudo.imageUrl), kudo.receiver?.name, kudo.event?.title)
    }

    async toDetailedKudoDto(kudo: Kudo): Promise<DetailedKudoDto> {
        if (!kudo.sendDateTime) throw new InternalServerErrorException(null, 'Something went wrong getting your kudo');
        if (!kudo.sender) throw new InternalServerErrorException(null, 'Something went wrong getting your kudo');
        if (!kudo.receiver) throw new InternalServerErrorException(null, 'Something went wrong getting your kudo');
        if (!kudo.event) throw new InternalServerErrorException(null, 'Something went wrong getting your kudo');
        if (!kudo.imageUrl) throw new InternalServerErrorException(null, 'Something went wrong getting your kudo');
        return new DetailedKudoDto(kudo.sendDateTime, kudo.sender, kudo.receiver, await this.imageService.getImage(kudo.imageUrl), kudo.event)
    }

}