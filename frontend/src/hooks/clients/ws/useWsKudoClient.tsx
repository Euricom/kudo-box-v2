import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Kudo } from '../../../domain';
import NoSocketConnectionError from '../../../domain/exception/noSocketConnectionError';

const useWsKudoClient = (onNewKudo: (kudo: Kudo) => void) => {
    const [socket, setSocket] = useState<SocketIOClient.Socket | undefined>();

    useEffect(() => {
        const createdSocket = io(`${process.env.API_WS_URL}/${process.env.WS_EVENT_NAMESPACE}`, {
            transports: ['websocket'],
            upgrade: true,
            autoConnect: true,
        });

        createdSocket.on('connect_error', (err: Error) => console.error(err));
        createdSocket.on(process.env.WS_NEW_KUDO!, (res: Kudo) => {
            onNewKudo(res);
        })

        setSocket(createdSocket);
    }, [])

    const selectEvent = (eventId: string, onKudosReceive: (kudos: Kudo[]) => void) => {
        if (!socket) throw new NoSocketConnectionError('No websocket connection available');
        socket.emit(process.env.WS_SELECT_EVENT!, eventId, (res: Kudo[]) => {
            console.log(res);
            onKudosReceive(res);
        });
    }

    return {
        selectEvent
    }
}

export default useWsKudoClient;