import Image from 'next/image'
import React from 'react';
import { useRouter } from 'next/router'
import { Event } from "../../domain"
import { Lock, LockOpen } from '@material-ui/icons';
import { useHttpEventClient } from '../../hooks/clients'
import classes from './EventList.module.scss';
import { useToasts } from 'react-toast-notifications';

interface EventListData {
    events: Event[]
}

export default function EventList(props: EventListData) {
    const router = useRouter()
    const { toggleActive } = useHttpEventClient();
    const { addToast } = useToasts();

    const handleEventClick = (id: string, title: string) => {
        router.push({
            pathname: '/ChooseTheme',
            query: { eventId: id, eventTitle: title }
        })
    }

    const onLockclick = async (id: string) => {
        try {
            await toggleActive(id);
            router.push('/');
        } catch (error) {
            addToast('Toggeling Event Failed', {
                appearance: 'error',
                autoDismiss: true,
                placement: 'top-center'
            });
        }
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

