import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { BasicKudo, EventRoom } from '../../../domain';
import NoSocketConnectionError from '../../../domain/exception/noSocketConnectionError';
import { useHttpEventClient } from '../http/useHttpEventClient';

const useWsKudoClient = () => {
    const [eventRoom, setEventRoom] = useState<EventRoom>();
    const socketRef = useRef<SocketIOClient.Socket>()
    const { getWsEventRoomUrl } = useHttpEventClient();

    useEffect(() => {
        (async function () {
            // TODO: if unauthorized --> do not connect
            const wsUrl = await getWsEventRoomUrl();
            connect(wsUrl);
        })()
    }, [])

    useEffect(() => {
        console.log(eventRoom);
    }, [eventRoom])

    const connect = async (wsUrl: string): Promise<void> => {
        const createdSocket = io(wsUrl, {
            transports: ['websocket'],
            upgrade: true,
            autoConnect: true
        });

        createdSocket.on(process.env.WS_NEW_KUDO!, (res: BasicKudo) => {
            handleNewKudo(res);
        })

        socketRef.current = createdSocket
    }

    const joinEventRoom = (eventId: string) => {
        if (!socketRef.current) throw new NoSocketConnectionError('No websocket connection available');

        socketRef.current.emit(process.env.WS_SELECT_EVENT!, eventId, (res: EventRoom) => handleEventRoomJoined(res));
    }

    function handleEventRoomJoined(eventRoom: EventRoom) {
        console.log(eventRoom);
        setEventRoom(eventRoom);
    }

    const handleNewKudo = (kudo: BasicKudo) => {
        setEventRoom((prevState: EventRoom): EventRoom => {
            if(!prevState) return prevState;
            return {...prevState, kudos: [...prevState.kudos, kudo]};
        });
    }

    return {
        eventRoom,
        joinEventRoom
    }
}

export default useWsKudoClient;