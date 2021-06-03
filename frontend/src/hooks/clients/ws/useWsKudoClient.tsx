import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { Kudo } from '../../../domain';
import NoSocketConnectionError from '../../../domain/exception/noSocketConnectionError';
import { useGetAccessToken } from '../useGetAccessToken';

const useWsKudoClient = (onNewKudo: (kudo: Kudo) => void) => {
    const socketRef = useRef<SocketIOClient.Socket>()

    const connect = async (wsUrl: string): Promise<void> => {
        const createdSocket = io(wsUrl, {
            transports: ['websocket'],
            upgrade: true,
            autoConnect: true
        });

        createdSocket.on('error', (err: Error) => console.error(err));
        createdSocket.on('connect_error', (err: Error) => console.error(err));
        createdSocket.on(process.env.WS_NEW_KUDO!, (res: Kudo) => {
            onNewKudo(res);
        })

        socketRef.current = createdSocket
    }

    const selectEvent = async (eventId: string, onKudosReceive: (kudos: Kudo[]) => void) => {
        if (!socketRef.current) throw new NoSocketConnectionError('No websocket connection available');
        socketRef.current.emit(process.env.WS_SELECT_EVENT!, eventId, (res: Kudo[]) => {
            onKudosReceive(res);
        });
    }

    return {
        connect,
        selectEvent
    }
}

export default useWsKudoClient;