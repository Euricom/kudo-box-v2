import Link from 'next/link'
import React, { KeyboardEventHandler, MouseEventHandler, useState } from 'react';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import { Menu, EmojiEvents, HomeOutlined, Redeem, CardMembership, AddCircle } from '@material-ui/icons';

import classes from '../styles/components/navbar.module.scss';

export default function Navbar() {
    const [state, setState] = useState(false);
    
    const toggleDrawer = (newState: boolean) => {
        return (event: React.KeyboardEvent | React.MouseEvent) => {
            if (
                event.type === 'keydown' &&
                ((event as React.KeyboardEvent).key === 'Tab' ||
                    (event as React.KeyboardEvent).key === 'Shift')
            ) {
                return;
            }
            setState(newState);
        }
    };

    const list = () => (
        <div
            className={classes.navbar}
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <h1>Kudos</h1>
            <ListItem className={classes.listItem} button >
                <HomeOutlined className={classes.icon} />
                <Link href="/">
                    <a>Home</a>
                </Link>
            </ListItem>
            <ListItem className={classes.listItem} button >
                <EmojiEvents className={classes.icon} />
                <Link href="/Events">
                    <a>Events</a>
                </Link>
            </ListItem>
            <ListItem className={classes.listItem} button >
                <Redeem className={classes.icon} />
                <Link href="/Kudos">
                    <a>Kudos</a>
                </Link>
            </ListItem>
            <ListItem className={classes.listItem} button >
                <CardMembership className={classes.icon} />
                <Link href="/MyKudos">
                    <a>My Kudos</a>
                </Link>
            </ListItem>
            <ListItem className={classes.listItem} button >
                <AddCircle className={classes.icon} />
                <Link href="/ChooseTheme">
                    <a>New Kudo</a>
                </Link>
            </ListItem>
        </div >
    );

    return (
        <div>
            <Button className={classes.menu} onClick={toggleDrawer(true)}><Menu className={classes.menuIcon} /></Button>
            <SwipeableDrawer
                open={state}
                onClose={toggleDrawer(false)}
                onOpen={toggleDrawer(true)}
            >
                {list()}
            </SwipeableDrawer>
        </div>
    );
}

