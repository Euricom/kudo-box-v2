import { useRef } from 'react';
import io from 'socket.io-client';
import { BasicKudo, EventRoom } from '../../../domain';
import NoSocketConnectionError from '../../../domain/exception/noSocketConnectionError';

const useWsKudoClient = (onNewKudo: (kudo: BasicKudo) => void) => {
    const socketRef = useRef<SocketIOClient.Socket>()

    const connect = async (wsUrl: string): Promise<void> => {
        const createdSocket = io(wsUrl, {
            transports: ['websocket'],
            upgrade: true,
            autoConnect: true
        });

        createdSocket.on(process.env.WS_NEW_KUDO!, (res: BasicKudo) => {
            onNewKudo(res);
        })

        socketRef.current = createdSocket
    }

    const joinEventRoom = async (eventId: string, onEventRoomJoined: (eventRoom: EventRoom) => void) => {
        if (!socketRef.current) throw new NoSocketConnectionError('No websocket connection available');
        socketRef.current.emit(process.env.WS_SELECT_EVENT!, eventId, (res: EventRoom) => {
            onEventRoomJoined(res);
        });
    }

    return {
        connect,
        joinEventRoom
    }
}

export default useWsKudoClient;