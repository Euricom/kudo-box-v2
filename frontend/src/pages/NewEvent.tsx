import React, { useState, ChangeEvent, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar/Navbar'
import Link from 'next/link'
import classes from '../styles/NewEvent.module.scss';
import axios from '../services/Axios';

interface MainEvent {
    id: string
    title: string
}

export default function newEvent() {
    const image = useRef<HTMLImageElement>(null);
    const label = useRef<HTMLLabelElement>(null);
    const [imageFile, setImageFile] = useState("");
    const [title, setTitle] = useState("");
    const [tags, setTags] = useState("");
    const [isMainEvent, setIsMainEvent] = useState(false);
    const [MainEventId, setMainEventId] = useState("");
    const [mainEvents, setMainEvents] = useState<MainEvent[]>([]);

    const handleFile = (e: any) => {
        if (image.current && label.current) {
            image.current.src = URL.createObjectURL(e.target.files[0]);
            label.current.innerText = "Change image"
            setImageFile(e.target.files[0])
        }
    }

    useEffect(() => {
        fetchMainEvents()
    }, [])

    const fetchMainEvents = async () => {
        let fetchedMainEvents = await axios.get<MainEvent[]>(
            '/event/main/basic',
            false
        );
        if (fetchedMainEvents) {
            setMainEvents(fetchedMainEvents.data);
        }
    }

    const handleChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const handleChangeTags = (e: ChangeEvent<HTMLInputElement>) => {
        setTags(e.target.value);
    };

    const handleChangeIsMainEvent = (e: ChangeEvent<HTMLInputElement>) => {
        setIsMainEvent(e.target.checked);
    };

    const handleChangeMainEventId = (e: ChangeEvent<HTMLSelectElement>) => {
        setMainEventId(e.target.value);
    };

    const createEvent = async () => {
        const formData = new FormData();
        formData.append('eventImage', imageFile);
        //temp id
        formData.append('hostId', "5a5dd307-0831-4fa6-a082-152713669da1");
        if (MainEventId) formData.append('mainEventId', MainEventId);
        formData.append('title', title);
        formData.append('isMainEvent', `${isMainEvent}`);
        formData.append('newTagName', tags);

        await axios.post(
            '/event/create', formData,
            false
        );
    }

    return (
        <>
            <div className={classes.contentHolder}>
                <Navbar />
                <h1>Create Event</h1>
                <div className={classes.imgHolder}>
                    <img ref={image} alt="event image" className={`${imageFile ? "" : classes.imageVis}`} />
                </div>

                <div className={classes.fileHolder}>
                    <input type="file" name="image" id="file" accept="image/*"
                        onChange={handleFile} className={classes.file} />
                    <label ref={label} className={classes.fileLabel} htmlFor="file">Choose an image</label>
                </div>

                <div className={classes.textbox}>
                    <label>Title:</label>
                    <input type="text" placeholder="Title" value={title} onChange={handleChangeTitle} />
                </div>

                <div className={classes.textbox}>
                    <label>Tags:</label>
                    <input type="text" placeholder="Tag" value={tags} onChange={handleChangeTags} />
                </div>

                <div className={classes.mainEventHolder}>
                    <label className={classes.mainEvent}>
                        Main Event
                        <input type="checkbox" checked={isMainEvent} onChange={handleChangeIsMainEvent} />
                        <span></span>
                    </label>

                    <select name="mainEvents" className={classes.mainEventPicker} onChange={handleChangeMainEventId} >
                        <option value="">none</option>
                        {mainEvents.map((event, index) => {
                            return <option key={`${event.id}.${index}`} value={event.id}>{event.title}</option>
                        })}
                    </select>
                </div>
            </div>

            <div className={classes.buttonHolder}>
                <Link href="/">
                    <a>Cancel</a>
                </Link>
                <Link href="/">
                    <a onClick={createEvent}>Create Event</a>
                </Link>
            </div>

        </>
    )
}
