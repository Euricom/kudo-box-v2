import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar/Navbar'
import EventsList from '../components/EventList/EventList'
import classes from '../styles/index.module.scss';
import { Event } from '../domain'
import { useHttpEventClient } from '../hooks/clients'
import Link from 'next/link'

interface Props {
    fetchedEvents: Event[]
}

export default function Home({ }: Props) {

    const [emptyState, setEmptyState] = useState(false)
    const [events, setEvents] = useState<Event[]>([])
    const { getFeaturedEvents } = useHttpEventClient();

    useEffect(() => {
        (async function () {
            const events = await getFeaturedEvents()
            if (events.length === 0) setEmptyState(true)
            setEvents(events)
        })();
    }, [])

    return (
        <>
            <Navbar />
            <h1>Home</h1>
            <div className={classes.eventsHolder}>
                {!emptyState && <EventsList events={events} />}
                {emptyState &&
                    <div className={classes.emptyStateHolder}>
                        <img src="/empty2.webp" alt="empty" />
                        <h4>Active events will show up here,</h4>
                        <h4>so you can easily view them here later.</h4>
                    </div>
                }
            </div>
            <Link href="/ChooseTheme">
                <a className={classes.newKudoCta}>Create Kudo</a>
            </Link>
        </>
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
