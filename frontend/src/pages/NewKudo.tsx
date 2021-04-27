import Navbar from '../components/navbar'
import CreateKudoBar from '../components/createKudoBar'
import React, { useState, useEffect } from 'react';
import Link from 'next/link'
import Image from 'next/image'
import classes from '../styles/NewKudo.module.scss';

export default function NewKudo() {

    const [value, setValue] = React.useState(null);

    useEffect(() => {
        setValue(localStorage.getItem('kudoTheme'))
    }, [])

    return (
        <div>
            <Navbar />
            <CreateKudoBar tab={2} />
            <div className={classes.image}>
                {value && <Image src={value} alt="kudo" layout="fill" />}
            </div>

            <div className={classes.buttonHolder}>
                <Link href="/">
                    <a >Cancel</a>
                </Link>
                <Link href="/">
                    <a >Create Kudo</a>
                </Link>
            </div>
        </div>
    )
}
