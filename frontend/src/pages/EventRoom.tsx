import { useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import useWsKudoClient from "../hooks/clients/ws/useWsKudoClient";

const eventIdVerjaardagJos = '7a73e957-45ad-445d-b9f8-ebd6e2807f85';

interface Props {

}

const EventRoom = ({}: Props) => {
    const { connectToEventRoom } = useWsKudoClient();

    const socketRef = useRef<Socket>(connectToEventRoom());

    return (
        <div></div>
    );
}

export default EventRoom;