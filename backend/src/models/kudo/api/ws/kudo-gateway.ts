import { OnEvent } from "@nestjs/event-emitter";
import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
// import { Server, Socket } from "socket.io";
import { Kudo } from "../../entities/kudo.entity";
import { KudoService } from "../../service/kudo.service";
import { BasicKudoDto } from "../dto/out/BasicKudo.dto";
import { KudoMapper } from "../mapper/kudo-mapper";

@WebSocketGateway({ namespace: 'event-room' })
export class KudoGateway implements OnGatewayConnection {
    @WebSocketServer()
    private _server!: any;

    constructor(
        private kudoMapper: KudoMapper,
        private kudoService: KudoService
    ) {}

    handleConnection(client: any, ...args: any[]) {
        console.log('connected')
        console.log(client.connected);
    }

    @SubscribeMessage('event-select')
    private async onEventSelect(
        @MessageBody() eventId: string, 
        @ConnectedSocket() client: any
    ): Promise<BasicKudoDto[]> {
        console.log(eventId);
        client.join(`event-${eventId}`);

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