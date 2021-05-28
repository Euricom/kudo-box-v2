import Image from 'next/image'
import React from 'react';
import { useRouter } from 'next/router'

import classes from './EventList.module.scss';

export interface Event {
    id: string;
    title: string;
    isMainEvent: boolean;
    creationDate: string;
    eventImage: string;
    tagName?: string;
}

interface EventListData {
    events: Event[]
}

export default function EventList(props: EventListData) {
    const router = useRouter()

    const handleEventClick = (id: string) => {
        //todo redirect naar choose theme met eventId
        router.push(`/ChooseTheme/`)
    }
    return (
        <>
            {
                props.events.map((event, index) => {
                    return <div key={`${event.id}.${index}`} onClick={() => handleEventClick(event.id)} className={classes.eventHolder}>
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

