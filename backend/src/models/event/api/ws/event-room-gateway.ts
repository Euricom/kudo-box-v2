import { OnEvent } from "@nestjs/event-emitter";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Kudo } from "../../../kudo/entities/kudo.entity";
import { KudoService } from "../../../kudo/service/kudo.service";
import { BasicKudoDto } from "../../../kudo/api/dto/out/BasicKudo.dto";
import { KudoMapper } from "../../../kudo/api/mapper/kudo-mapper";

@WebSocketGateway({ namespace: process.env.WS_EVENT_NAMESPACE })
export class EventRoomGateway {
    @WebSocketServer()
    private _server!: Server;

    constructor(
        private kudoMapper: KudoMapper,
        private kudoService: KudoService
    ) {}

    @SubscribeMessage(process.env.WS_SELECT_EVENT)
    private async onEventSelect(
        @MessageBody() eventId: string, 
        @ConnectedSocket() client: Socket
    ): Promise<BasicKudoDto[]> {
        client.leaveAll();
        client.join(`event-${eventId.toUpperCase()}`);

        const kudos = await this.kudoService.getKudosOfEvent(eventId);
        
        return Promise.all(kudos.map(k => this.kudoMapper.toBasicKudoDto(k)));
    }

    
    @OnEvent(process.env.EVENT_KUDO_CREATED!)
    private async broadcastKudos(createdKudo: Kudo) {
        if(!createdKudo.event) return;

        const createdKudoDto = await this.kudoMapper.toBasicKudoDto(createdKudo);

        this._server.to(`event-${createdKudo.event.id}`).emit(process.env.WS_NEW_KUDO!, createdKudoDto);
    }
}