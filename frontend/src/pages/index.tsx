import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar/Navbar'
import EventsList, { Event } from '../components/EventList/EventList'
import classes from '../styles/index.module.scss';
import useKudoClient from '../hooks/useKudoClient';

interface Props {
    fetchedEvents: Event[]
}

export default function Home({ fetchedEvents }: Props) {

    const [events, setEvents] = useState<Event[]>([])
    const { getFeaturedEvents } = useKudoClient();

    useEffect(() => {
        (async function () {
            setEvents(await getFeaturedEvents())
        })();
    }, [])

    return (
        <div>
            <Navbar />
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
