import { useEffect, useRef } from "react";
import useWsKudoClient from "../hooks/clients/ws/useWsKudoClient";

const eventIdVerjaardagJos = '7a73e957-45ad-445d-b9f8-ebd6e2807f85';

interface Props {

}

const EventRoom = ({}: Props) => {
    const { connectToEventRoom, selectEvent } = useWsKudoClient();

    useEffect(() => {
        connectToEventRoom();
    }, [])

    const handleEventSelect = (eventId: string) => {
        selectEvent(eventId);
    }

    return (
        <button onClick={() => handleEventSelect(eventIdVerjaardagJos)} >Click me</button>
    );
}

export default EventRoom;