import { OnEvent } from "@nestjs/event-emitter";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket } from "node:dgram";

import { Server } from "node:net";
import { Kudo } from "../../entities/kudo.entity";
import { KudoService } from "../../service/kudo.service";
import { BasicKudoDto } from "../dto/out/BasicKudo.dto";
import { KudoMapper } from "../mapper/kudo-mapper";

@WebSocketGateway()
export class KudoGateway {
    @WebSocketServer()
    private _server!: Server;

    constructor(
        private kudoMapper: KudoMapper,
        private kudoService: KudoService
    ) {}

    @SubscribeMessage('join-room')
    private async joinEventRoom(
        @MessageBody() eventId: string, 
        @ConnectedSocket() client: Socket
    ): Promise<BasicKudoDto[]> {
        client.join(`event-${eventId}`);

        const kudos = await this.kudoService.getKudosOfEvent(eventId);
        
        return Promise.all(kudos.map(k => this.kudoMapper.toBasicKudoDto(k)));
    }

    @OnEvent(process.env.EVENT_KUDO_CREATED!)
    private async broadcastKudos(createdKudo: Kudo) {
        const createdKudoDto = await this.kudoMapper.toBasicKudoDto(createdKudo);

        this._server.emit('new-kudo', createdKudoDto);
    }
}