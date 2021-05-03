import Link from 'next/link'
import React from 'react';

import classes from '../styles/components/createKudoBar.module.scss';

export default function CreateKudoBar(props) {

    return (
        <div className={classes.holder}>
            <Link href="/ScanKudo">
                <a className={`${props.tab === 1 ? classes.border : ''}`}>Scan</a>
            </Link>
            <Link href="/ChooseTheme">
                <a className={`${props.tab === 2 ? classes.border : ""}`}>Create</a>
            </Link>
        </div >
    );
}

