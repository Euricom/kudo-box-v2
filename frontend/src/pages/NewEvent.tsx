import React, { useState, ChangeEvent, useRef, useEffect } from 'react';
import Link from 'next/link'
import classes from '../styles/NewEvent.module.scss';
import { useHttpEventClient, CreateEventDto } from '../hooks/clients';
import { useToasts } from 'react-toast-notifications';
import PictureInput from '../components/PictureInput/PictureInput';
import useNewEventValidator from '../hooks/validation/useNewEventValidator';
import GlobalFormError from '../components/GlobalFormError/GlobalFormError';
import { useRouter } from 'next/router';
import ValidatableInput from '../components/ValidatableInput/ValidateableInput';
import Drawer from '../components/Drawer/Drawer';

export interface MainEvent {
    id: string
    title: string
}

export interface NewEvent {
    image?: File;
    title: string;
    newTagName: string;
    isMainEvent: boolean;
    mainEventId: string
}

export default function newEvent() {
    const [newEvent, setNewEvent] = useState<NewEvent>({
        image: undefined,
        title: '',
        newTagName: '',
        isMainEvent: false,
        mainEventId: ''
    });
    const [mainEvents, setMainEvents] = useState<MainEvent[]>([]);
    const [showError, setShowError] = useState<boolean>(false);

    const { createEvent, getMainEvents } = useHttpEventClient();
    const { errors, validateNewEvent } = useNewEventValidator();
    const { addToast } = useToasts();
    const router = useRouter();

    useEffect(() => {
        (async function () {
            try {
                setMainEvents(await getMainEvents())
            } catch (error) {
                addToast('Getting main events failed', {
                    appearance: 'error',
                    autoDismiss: true,
                    placement: 'top-center'
                });
            }

        })();
    }, [])

    useEffect(() => {
        if (showError) validateNewEvent(newEvent);
    }, [newEvent, showError])

    useEffect(() => {
        if (!errors.global.length && !errors.title && !errors.newTagName) setShowError(false);
    }, [errors])


    const handleImageChange = (image: File) => setNewEvent((prev: NewEvent) => ({ ...prev, image }))

    const handleChangeTitle = (title: string) => setNewEvent((prev: NewEvent) => ({ ...prev, title }));

    const handleNewTagNameChange = (newTagName: string) => setNewEvent((prev: NewEvent) => ({ ...prev, newTagName }));

    const handleChangeIsMainEvent = (e: ChangeEvent<HTMLInputElement>) => setNewEvent((prev: NewEvent) => ({ ...prev, isMainEvent: e.target.checked }));

    const handleChangeMainEventId = (e: ChangeEvent<HTMLSelectElement>) => setNewEvent((prev: NewEvent) => ({ ...prev, mainEventId: e.target.value }));

    const handleSubmitEvent = async () => {
        if (!validateNewEvent(newEvent)) return setShowError(true);

        const createEventDto: CreateEventDto = {
            eventImage: newEvent.image!,
            title: newEvent.title.trim(),
            isMainEvent: newEvent.isMainEvent,
            newTagName: newEvent.newTagName.trim(),
            mainEventId: newEvent.mainEventId
        }
        try {
            await createEvent(createEventDto);
            router.push('/');
            addToast('Event Created Successfully', {
                appearance: 'success',
                autoDismiss: true,
                placement: 'top-center'
            });
        } catch (error) {
            addToast('Event Creation Failed', {
                appearance: 'error',
                autoDismiss: true,
                placement: 'top-center'
            });
        }
    }

    return (
        <div className={classes.contentHolder}>
            <Drawer />
            <h1>Create Event</h1>
            <div className={classes.formWrapper}>
                <PictureInput
                    imageFile={newEvent.image}
                    onImageChange={handleImageChange}
                />

                <div className={classes.textbox}>
                    <label>Title:</label>
                    <ValidatableInput value={newEvent.title} onChange={handleChangeTitle} placeholder="Title" error={errors.title} />
                </div>

                <div className={classes.textbox}>
                    <label>Tag:</label>
                    <ValidatableInput value={newEvent.newTagName} onChange={handleNewTagNameChange} placeholder="Tag" error={errors.newTagName} />
                </div>

                <div className={classes.mainEventHolder}>
                    <label className={classes.mainEvent}>
                        Main Event
                        <input type="checkbox" checked={newEvent.isMainEvent} onChange={handleChangeIsMainEvent} />
                        <span></span>
                    </label>

                    <select name="mainEvents" className={classes.mainEventPicker} onChange={handleChangeMainEventId} >
                        <option value="">none</option>
                        {mainEvents.map((event, index) => {
                            return <option key={`${event.id}.${index}`} value={event.id}>{event.title}</option>
                        })}
                    </select>
                </div>

                {showError && !!errors.global.length && <GlobalFormError errors={errors.global} />}
            </div>
            <div className={classes.buttonHolder}>
                <Link href="/">
                    <a>Cancel</a>
                </Link>
                <button onClick={handleSubmitEvent}>Create Event</button>
            </div>
        </div>
    )
}
