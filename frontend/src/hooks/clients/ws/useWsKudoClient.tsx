import { io, Socket } from 'socket.io-client';

const useWsKudoClient = () => {
    const connectToEventRoom = (): Socket => {
        return io(`${process.env.API_WS_URL}/event-room`, {
            transports: ['websocket'],
            upgrade: true
        });
    }

    return {
        connectToEventRoom
    }
}

export default useWsKudoClient;