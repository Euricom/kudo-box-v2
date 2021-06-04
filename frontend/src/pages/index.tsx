import React, { useEffect, useState } from 'react';
import Drawer from '../components/Drawer/Drawer'
import EventsList from '../components/EventList/EventList'
import classes from '../styles/index.module.scss';
import { Event } from '../domain'
import { useHttpEventClient } from '../hooks/clients'

interface Props {
    fetchedEvents: Event[]
}

export default function Home({ }: Props) {

    const [events, setEvents] = useState<Event[]>([])
    const { getFeaturedEvents } = useHttpEventClient();

    useEffect(() => {
        (async function () {
            setEvents(await getFeaturedEvents())
        })();
    }, [])

    return (
        <div>
            <Drawer />
            <h1>Home</h1>
            <div className={classes.eventsHolder}>
                <EventsList events={events} />
            </div>
        </div>
    );
}

// export async function getStaticProps() {
//     const fetchedEvents = await axios.get<Event[]>(
//         '/event/getFeatured',
//         false
//     );
//     if (fetchedEvents) {
//         return {
//             props: { fetchedEvents: fetchedEvents.data } as Props
//         }
//     }
//     return { props: { fetchedEvents: [] } as Props };
// }
