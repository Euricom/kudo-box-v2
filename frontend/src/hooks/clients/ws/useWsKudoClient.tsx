import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { BasicKudo, EventRoom } from '../../../domain';
import NoSocketConnectionError from '../../../domain/exception/noSocketConnectionError';
import { useHttpEventClient } from '../http/useHttpEventClient';

const useWsKudoClient = (onNewKudo: () => void) => {
    const [eventRoom, setEventRoom] = useState<EventRoom | undefined>();
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout>();
    const socketRef = useRef<SocketIOClient.Socket>()
    const { getWsEventRoomUrl, getKudosOfEvent, getEventRoom } = useHttpEventClient();

    useEffect(() => {
        // (async function () {
        //     // TODO: if unauthorized --> do not connect
        //     const wsUrl = await getWsEventRoomUrl();
        //     connect(wsUrl);
        // })()
    }, [])

    const connect = async (wsUrl: string): Promise<void> => {
        const createdSocket = io(wsUrl, {
            transports: ['polling'],
            upgrade: true,
            autoConnect: true
        });

        createdSocket.on('error', (error: any) => console.log(error))

        //here
        createdSocket.on(process.env.WS_NEW_KUDO!, (res: BasicKudo) => {
            handleNewKudo(res);
        })

        socketRef.current = createdSocket
    }

    const joinEventRoom = (eventId: string) => {
        if (!socketRef.current) throw new NoSocketConnectionError('No websocket connection available');

        socketRef.current.emit(process.env.WS_SELECT_EVENT!, eventId, (res: EventRoom) => handleEventRoomJoined(res));
    }

    const joinEventRoomPolling = async (eventId: string) => {
        const eventRoom = await getEventRoom(eventId);
        setEventRoom(eventRoom);

        pollKudosEventRoom(eventId);
    }

    const pollKudosEventRoom = (eventId: string) => {
        if(intervalId) clearInterval(intervalId);

        setIntervalId(setInterval(async () => {
            const newKudos = await getKudosOfEvent(eventId);
            handleNewKudoPolling(newKudos);
        }, 1000))
    }

    function handleEventRoomJoined(eventRoom: EventRoom) {
        setEventRoom(eventRoom);
    }

    const handleNewKudo = (kudo: BasicKudo) => {
        onNewKudo();
        setEventRoom((prevState: EventRoom | undefined) => {
            if(!prevState) return prevState;
            const newKudos = [...prevState.kudos];
            newKudos.unshift(kudo);
            prevState.kudos = newKudos;
            return prevState;
        });
    }

    const handleNewKudoPolling = (kudos: BasicKudo[]) => {
        onNewKudo();
        setEventRoom((prevState: EventRoom | undefined) => {
            if(!prevState) return prevState;
            return {...prevState, kudos };
        });
    }

    return {
        eventRoom,
        joinEventRoom,
        joinEventRoomPolling
    }
}

export default useWsKudoClient;