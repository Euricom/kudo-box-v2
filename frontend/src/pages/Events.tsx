import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar/Navbar'
import AddButton from '../components/AddButton/AddButton'
import EventsList from '../components/EventList/EventList'
import classes from '../styles/Events.module.scss';
import { Event } from '../domain'
import { useKudoClient } from '../hooks/clients'

interface Props {
    fetchedEvents: Event[]
}

export default function events({ fetchedEvents }: Props) {

    const [events, setEvents] = useState<Event[]>([])
    const { getAllEvents } = useKudoClient();

    useEffect(() => {
        (async function () {
            setEvents(await getAllEvents())
        })();
    }, [])

    return (
        <>
            <div className={classes.navHolder}>
                <Navbar />
                <h1>Events</h1>
            </div>
            <div className={classes.eventsHolder}>
                <EventsList events={events} />
            </div>
            <AddButton location={"/NewEvent"} />
        </>
    )
}

// export async function getStaticProps() {
//     const fetchedEvents = await axios.get<Event[]>(
//         '/event/getAll',
//         false
//     );
//     if (fetchedEvents) {
//         return {
//             props: { fetchedEvents: fetchedEvents.data } as Props
//         }
//     }
//     return { props: { fetchedEvents: [] } as Props };
// }

