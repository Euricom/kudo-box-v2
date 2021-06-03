import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { Kudo } from '../../../domain';
import NoSocketConnectionError from '../../../domain/exception/noSocketConnectionError';
import { useGetAccessToken } from '../useGetAccessToken';

const useWsKudoClient = (onNewKudo: (kudo: Kudo) => void) => {
    const socketRef = useRef<SocketIOClient.Socket>()
    const { getAccessToken } = useGetAccessToken()

    useEffect(() => {
        (async function() {
            const accessToken = (await getAccessToken()) as string

            const createdSocket = io(`${process.env.API_WS_URL}/${process.env.WS_EVENT_NAMESPACE}`, {
                transports: ['websocket'],
                upgrade: true,
                autoConnect: true,
                auth: `Bearer ${accessToken}`
            });
    
            createdSocket.on('error', (err: Error) => console.error(err));
            createdSocket.on('connect_error', (err: Error) => console.error(err));
            createdSocket.on(process.env.WS_NEW_KUDO!, (res: Kudo) => {
                onNewKudo(res);
            })
    
            socketRef.current = createdSocket
        }) ();
    }, [])

    const selectEvent = async (eventId: string, onKudosReceive: (kudos: Kudo[]) => void) => {
        if (!socketRef.current) throw new NoSocketConnectionError('No websocket connection available');
        socketRef.current.emit(process.env.WS_SELECT_EVENT!, eventId, (res: Kudo[]) => {
            onKudosReceive(res);
        });
    }

    return {
        selectEvent
    }
}

export default useWsKudoClient;