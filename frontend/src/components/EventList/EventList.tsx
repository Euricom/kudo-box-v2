import Image from 'next/image'
import React, { MouseEvent } from 'react';
import { useRouter } from 'next/router'
import { Event } from "../../domain"
import { Lock, LockOpen } from '@material-ui/icons';
import { useHttpEventClient } from '../../hooks/clients'
import classes from './EventList.module.scss';

interface EventListData {
    events: Event[]
}

export default function EventList(props: EventListData) {
    const router = useRouter()
    const { toggleActive } = useHttpEventClient();

    const handleEventClick = (id: string, title: string) => {
        router.push({
            pathname: '/ChooseTheme',
            query: { eventId: id, eventTitle: title }
        })
    }

    const onLockclick = async (id: string) => {
        await toggleActive(id);
        router.push('/');
    }

    return (
        <>
            {
                props.events.map((event, index) => {
                    return <div key={`${event.id}.${index}`} className={classes.eventHolder}>
                        <div onClick={() => handleEventClick(event.id, event.title)} className={classes.contentHolder}>
                            <div className={classes.imageHolder}>
                                <Image src={atob(event.eventImage)} alt="kudo" layout="fill" />
                            </div>
                            <div className={classes.infoHolder}>
                                <p className={classes.tabbed}>{event.title}</p>
                                <p>{`# ${event.tagName}`}</p>
                                <p>{event.creationDate}</p>
                            </div>
                        </div>
                        <button
                            className={classes.buttonHolder}
                            onClick={() => onLockclick(event.id)}>
                            {!event.active && <Lock className={classes.icon} />}
                            {event.active && <LockOpen className={classes.icon} />}
                        </button>
                    </div>
                })
            }
        </>
    );
}

