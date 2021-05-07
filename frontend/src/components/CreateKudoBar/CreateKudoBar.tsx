import Link from 'next/link'
import React from 'react';

import classes from './createKudoBar.module.scss';

export enum Tabs {
    Scan,
    Kudo
}

interface Tab {
    tab: Tabs
}

export default function CreateKudoBar(props: Tab) {
    return (
        <div className={classes.holder}>
            <Link href="/ScanKudo">
                <a className={`${props.tab === Tabs.Scan ? classes.border : ''}`}>Scan</a>
            </Link>
            <Link href="/ChooseTheme">
                <a className={`${props.tab === Tabs.Kudo ? classes.border : ""}`}>Create</a>
            </Link>
        </div >
    );
}

