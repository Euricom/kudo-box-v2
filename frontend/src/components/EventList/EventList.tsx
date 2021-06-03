import Image from 'next/image'
import React from 'react';
import { useRouter } from 'next/router'
import { Event } from "../../domain"
import classes from './EventList.module.scss';

interface EventListData {
    events: Event[]
}

export default function EventList(props: EventListData) {
    const router = useRouter()

    const handleEventClick = (id: string, title: string) => {
        router.push({
            pathname: '/ChooseTheme',
            query: { eventId: id, eventTitle: title}
        })
    }
    return (
        <>
            {
                props.events.map((event, index) => {
                    return <div key={`${event.id}.${index}`} onClick={() => handleEventClick(event.id, event.title)} className={classes.eventHolder}>
                        <div className={classes.imageHolder}>
                            <Image src={atob(event.eventImage)} alt="kudo" layout="fill" />
                        </div>
                        <div className={classes.infoHolder}>
                            <p className={classes.tabbed}>{event.title}</p>
                            <p>{`# ${event.tagName}`}</p>
                            <p>{event.creationDate}</p>
                        </div>
                    </div>
                })
            }
        </>
    );
}

