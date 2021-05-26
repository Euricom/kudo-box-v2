import React from 'react';
import Navbar from '../components/Navbar/Navbar'
import AddButton from '../components/AddButton/AddButton'
import EventsList from '../components/EventList/EventList'
import axios from '../services/Axios';
import classes from '../styles/Events.module.scss';

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

export default function events({ fetchedEvents }: Props) {

    return (
        <>
            <div className={classes.navHolder}>
                <Navbar />
                <h1>Events</h1>
            </div>
            <div className={classes.eventsHolder}>
                <EventsList events={fetchedEvents} />
            </div>
            <AddButton location={"/NewEvent"} />
        </>
    )
}

export async function getStaticProps() {
    const fetchedEvents = await axios.get<Event[]>(
        '/event/getAll',
        false
    );
    if (fetchedEvents) {
        return {
            props: { fetchedEvents: fetchedEvents.data } as Props
        }
    }
    return { props: { fetchedEvents: [] } as Props };
}

