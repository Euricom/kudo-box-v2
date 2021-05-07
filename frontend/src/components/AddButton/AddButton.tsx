import Link from 'next/link'
import React from 'react';

import classes from './AddButton.module.scss';

export enum Tabs {
    Scan,
    Kudo
}

interface NavTo {
    location: string
}

export default function CreateKudoBar(props: NavTo) {
    return (
        <Link href={props.location}>
            <a className={classes.addButton}>+</a>
        </Link>
    );
}

