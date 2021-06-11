import { OnEvent } from "@nestjs/event-emitter";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Kudo } from "../../../kudo/entities/kudo.entity";
import { KudoMapper } from "../../../kudo/api/mapper/kudo-mapper";
import { EventService } from "../../service/event/event.service";
import { EventMapper } from "../mapper/event-mapper";
import { EventRoomDto } from "../dto/out/EventRoom.dto";
import { Injectable } from "@nestjs/common";

@Injectable()
@WebSocketGateway({ namespace: process.env.WS_EVENT_NAMESPACE })
export class EventRoomGateway {
    @WebSocketServer()
    private _server!: Server;

    constructor(
        private eventMapper: EventMapper,
        private kudoMapper: KudoMapper,
        private eventService: EventService
    ) {

    }

    @SubscribeMessage(process.env.WS_SELECT_EVENT)
    private async onEventSelect(
        @MessageBody() eventId: string,
        @ConnectedSocket() client: Socket
    ): Promise<EventRoomDto | string> {
        client.leaveAll();
        client.join(`event-${eventId.toUpperCase()}`);

        const event = await this.eventService.getEventWithHostAndKudos(eventId)
        if (!event) return `No event found with id ${eventId}`;

        return this.eventMapper.toEventRoomDto(event);
    }


    @OnEvent(process.env.EVENT_KUDO_CREATED!)
    private async broadcastKudos(createdKudo: Kudo) {
        if (!createdKudo.event) return;

        const createdKudoDto = await this.kudoMapper.toBasicKudoDto(createdKudo);

        this._server.to(`event-${createdKudo.event.id?.toUpperCase()}`).emit(process.env.WS_NEW_KUDO!, createdKudoDto);
    }
}