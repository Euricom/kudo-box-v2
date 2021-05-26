import React from 'react';
import Navbar from '../components/Navbar/Navbar'
import EventsList from '../components/EventList/EventList'
import axios from '../services/Axios';
import classes from '../styles/index.module.scss';

interface Event {
    id: string;
    title: string;
    isMainEvent: boolean;
    creationDate: string;
    eventImage: string;
    tagName?: string;
}

interface Props {
    fetchedEvents: Event[]
}

export default function Home({ fetchedEvents }: Props) {
    return (
        <div>
            <Navbar />
            <h1>Home</h1>
            <div className={classes.eventsHolder}>
                <EventsList events={fetchedEvents} />
            </div>
        </div>
    );
}

export async function getStaticProps() {
    const fetchedEvents = await axios.get<Event[]>(
        '/event/getFeatured',
        false
    );
    if (fetchedEvents) {
        return {
            props: { fetchedEvents: fetchedEvents.data } as Props
        }
    }
    return { props: { fetchedEvents: [] } as Props };
}
