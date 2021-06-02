import { useState } from "react";
import { Kudo } from "../domain";
import useWsKudoClient from "../hooks/clients/ws/useWsKudoClient";

const eventIdVerjaardagJos = 'f14c73cd-133b-4944-af3a-883de2962267';

interface Props {

}

const EventRoom = ({}: Props) => {
    const [kudos, setKudos] = useState<Kudo[]>([])
    const { selectEvent } = useWsKudoClient(handleNewKudo);

    const handleEventSelect = (eventId: string) => {
        selectEvent(eventId, handleKudosReceive);
    }

    const handleKudosReceive = (kudos: Kudo[]) => {
        setKudos(kudos);
    }

    function handleNewKudo (kudo: Kudo) {
        setKudos([...kudos, kudo]);
    }


    return (
        <button onClick={() => handleEventSelect(eventIdVerjaardagJos)} >Click me</button>
    );
}

export default EventRoom;