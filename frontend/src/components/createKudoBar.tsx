import Link from 'next/link'
import React from 'react';

import classes from '../styles/components/createKudoBar.module.scss';

export default function CreateKudoBar(tab) {

    return (
        <div className={classes.holder}>
            <Link href="/ScanKudo">
                <a className={`${tab.tab === 1 ? classes.border : ''}`}>Scan</a>
            </Link>
            <Link href="/ChooseTheme">
                <a className={`${tab.tab === 2 ? classes.border : ""}`}>Create</a>
            </Link>
        </div >
    );
}

