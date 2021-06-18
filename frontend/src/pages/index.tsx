import React, { useEffect, useState } from 'react';
import Drawer from '../components/Drawer/Drawer'
import EventsList from '../components/EventList/EventList'
import classes from '../styles/index.module.scss';
import { Event } from '../domain'
import { useHttpEventClient } from '../hooks/clients'
import Link from 'next/link'
import { useToasts } from 'react-toast-notifications';

export default function Home() {

    const [emptyState, setEmptyState] = useState(false)
    const [events, setEvents] = useState<Event[]>([])
    const { getFeaturedEvents } = useHttpEventClient();
    const { addToast } = useToasts();

    useEffect(() => {
        (async function () {
            try {
                const events = await getFeaturedEvents()
                if (events.length === 0) setEmptyState(true)
                setEvents(events)
            } catch (error) {
                addToast('Getting events Failed', {
                    appearance: 'error',
                    autoDismiss: true,
                    placement: 'top-center'
                });
            }
        })();
    }, [])

    return (
        <>
            <Drawer />
            <h1>Home</h1>
            <div className={classes.eventsHolder}>
                {!emptyState && <EventsList showActive={false} events={events} />}
                {emptyState &&
                    <div className={classes.emptyStateHolder}>
                        <img src="/emptyState.webp" alt="empty" />
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