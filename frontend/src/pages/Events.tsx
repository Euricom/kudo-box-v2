import React from 'react';
import Navbar from '../components/Navbar'
import Link from 'next/link'
import classes from '../styles/Events.module.scss';

export default function events() {
    return (
        <div>
            <Navbar />
            <Link href="/ScanKudo">
                <a className={classes.addButton}>+</a>
            </Link>
        </div>
    )
}
