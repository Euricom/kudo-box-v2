import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar/Navbar'
import AddButton from '../components/AddButton/AddButton'
import EventsList from '../components/EventList/EventList'
import classes from '../styles/Events.module.scss';
import SearchIcon from '@material-ui/icons/Search';
import DebouncedSearch from '../components/DebouncedSearch/DebouncedSearch';
import { Event } from '../domain'
import { useHttpEventClient } from '../hooks/clients'
import { useToasts } from 'react-toast-notifications';

export default function events() {

    const [events, setEvents] = useState<Event[]>([])
    const { getAllEvents } = useHttpEventClient();
    const { addToast } = useToasts();

    useEffect(() => {
        fetchAllEvents();
    }, [])

    const fetchAllEvents = async () => {
        try {
            setEvents(await getAllEvents())
        } catch (error) {
            addToast('Getting events Failed', {
                appearance: 'error',
                autoDismiss: true,
                placement: 'top-center'
            });
        }
    }

    const handleFilterInputChange = async (filterValue: string) => {
        try {
            setEvents(await getAllEvents(filterValue))
        } catch (error) {
            addToast('Getting Events Failed', {
                appearance: 'error',
                autoDismiss: true,
                placement: 'top-center'
            });
        }
    }

    return (
        <>
            <div className={classes.topHolder}>
                <Navbar />
                <h1>Events</h1>
                <DebouncedSearch
                    onDebounceComplete={handleFilterInputChange}
                    onDebouncedCanceled={fetchAllEvents}
                    renderPreIcon={() => <SearchIcon />}
                />
            </div>
            <div className={classes.eventsHolder}>
                <EventsList events={events} />
            </div>
            <AddButton location={"/NewEvent"} />
        </>
    )
}