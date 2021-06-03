import { useEffect, useState } from "react";
import { BasicKudo } from "../domain";
import { useHttpEventClient } from "../hooks/clients";
import useWsKudoClient from "../hooks/clients/ws/useWsKudoClient";

const eventIdVerjaardagJos = 'f14c73cd-133b-4944-af3a-883de2962267';

interface Props {

}

const EventRoom = ({}: Props) => {
    const [kudos, setKudos] = useState<BasicKudo[]>([])
    const { selectEvent, connect } = useWsKudoClient(handleNewKudo);
    const { getWsEventRoomUrl } = useHttpEventClient();

    useEffect(() => {
        (async function() {
            const wsUrl = await getWsEventRoomUrl();
            connect(wsUrl);
        }) ()
    }, [])

    const handleEventSelect = (eventId: string) => {
        selectEvent(eventId, handleKudosReceive);
    }

    const handleKudosReceive = (kudos: BasicKudo[]) => {
        setKudos(kudos);
    }

    function handleNewKudo (kudo: BasicKudo) {
        setKudos([...kudos, kudo]);
    }


    return (
        <button onClick={() => handleEventSelect(eventIdVerjaardagJos)} >Click me</button>
    );
}

export default EventRoom;