import { useState } from 'react';
import io from 'socket.io-client';
import NoSocketConnectionError from '../../../domain/exception/noSocketConnectionError';

const useWsKudoClient = () => {
    const [socket, setSocket] = useState<SocketIOClient.Socket | undefined>();

    const connectToEventRoom = (): void => {
        const socket = io(`${process.env.API_WS_URL}/event-room`, {
            transports: ['websocket'],
            upgrade: true,
            autoConnect: true,
        });

        socket.on('connect', () => console.log('connected'));
        socket.on('connect_error', (err: Error) => console.error(err));

        setSocket(socket);
    }

    const selectEvent = (eventId: string) => {
        console.log(socket);
        console.log(process.env.WS_SELECT_EVENT)
        if(!socket) throw new NoSocketConnectionError('No websocket connection available');
        socket.emit('event-select', eventId);
    }

    return {
        connectToEventRoom,
        selectEvent
    }
}

export default useWsKudoClient;