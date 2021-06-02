import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar/Navbar'
import AddButton from '../components/AddButton/AddButton'
import EventsList from '../components/EventList/EventList'
import classes from '../styles/Events.module.scss';
import SearchIcon from '@material-ui/icons/Search';
import DebouncedSearch from '../components/DebouncedSearch/DebouncedSearch';
import { Event } from '../domain'
import { useEventClient } from '../hooks/clients'

interface Props {
    fetchedEvents: Event[]
}

export default function events({ }: Props) {

    const [events, setEvents] = useState<Event[]>([])
    const { getAllEvents } = useEventClient();

    useEffect(() => {
        (async function () {
            setEvents(await getAllEvents())
        })();
    }, [])

    const handleFilterInputChange = async (filterValue: string) => {
        setEvents(await getAllEvents(filterValue))
    }

    return (
        <>
             <div className={classes.topHolder}>
                <Navbar />
                <h1>Events</h1>
                <DebouncedSearch
                    onDebounceComplete={handleFilterInputChange}
                    onDebouncedCanceled={async () => setEvents(await getAllEvents())}
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

