import Navbar from '../components/Navbar'
import CreateKudoBar from '../components/CreateKudoBar'
import React, { useState, useEffect } from 'react';
import Link from 'next/link'
import Image from 'next/image'

import classes from '../styles/NewKudo.module.scss';

export default function NewKudo() {

    const [value, setValue] = useState(null);

    useEffect(() => {
        setValue(localStorage.getItem('kudoTheme'))
    }, [])

    return (
        <>
            <Navbar />
            <CreateKudoBar tab={2} />
            <div className={classes.image}>
                {value && <Image src={value} alt="kudo" layout="fill" />}
                <textarea placeholder="Write something nice !" className={classes.kudoText} />
                {/* todo: maxlength for screenwidths */}
                <input type="text" placeholder="Tags" className={classes.tags} />
            </div>


            <div className={classes.to}>
                <label>To:</label>
                <input type="text" placeholder="Name" />
            </div>



            <div className={classes.buttonHolder}>
                <Link href="/">
                    <a >Cancel</a>
                </Link>
                <Link href="/">
                    <a >Create Kudo</a>
                </Link>
            </div>
        </>
    )
}
