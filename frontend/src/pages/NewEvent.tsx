import React from 'react';
import Navbar from '../components/Navbar'
import Link from 'next/link'
import classes from '../styles/NewEvent.module.scss';

export default function newEvent() {
    return (
        <>
            <div className={classes.contentHolder}>


                <Navbar />
                <h1 className={classes.title}>Create Event</h1>

                <div className={classes.upload}>

                </div>
                <div className={classes.textbox}>
                    <label>Title:</label>
                    <input type="text" placeholder="Title" />
                </div>

                <div className={classes.textbox}>
                    <label>Tags:</label>
                    <input type="text" placeholder="Tag" />
                </div>

                <label className={classes.mainEvent}>Main Event
                <input type="checkbox" />
                    <span></span>
                </label>
            </div>
            <div className={classes.buttonHolder}>
                <Link href="/">
                    <a >Cancel</a>
                </Link>
                <Link href="/">
                    <a >Create Event</a>
                </Link>
            </div>

        </>
    )
}
