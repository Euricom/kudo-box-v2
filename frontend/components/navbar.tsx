import Link from 'next/link'
import React from 'react';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import { Menu, EmojiEvents, HomeOutlined, Redeem, CardMembership, AddCircle } from '@material-ui/icons';

import classes from '../styles/components/navbar.module.scss';

export default function navbar() {
    const [state, setState] = React.useState(false);

    const toggleDrawer = (state) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setState(state);
    };

    const list = () => (
        <div
            className={classes.navbar}
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <h1>Kudos</h1>
            <ListItem className={classes.listItem} button >
                <HomeOutlined className={classes.icon}/>
                <Link href="/">
                    <a>Home</a>
                </Link>
            </ListItem>
            <ListItem className={classes.listItem} button >
                <EmojiEvents className={classes.icon}/>
                <Link href="/Events">
                    <a>Events</a>
                </Link>
            </ListItem>
            <ListItem className={classes.listItem} button >
                <Redeem className={classes.icon}/>
                <Link href="/Kudos">
                    <a>Kudos</a>
                </Link>
            </ListItem>
            <ListItem className={classes.listItem} button >
                <CardMembership className={classes.icon}/>
                <Link href="/MyKudos">
                    <a>My Kudos</a>
                </Link>
            </ListItem>
            <ListItem className={classes.listItem} button >
                <AddCircle className={classes.icon}/>
                <Link href="/NewKudo">
                    <a>New Kudo</a>
                </Link>
            </ListItem>
        </div >
    );

    return (
        <div>
            <Button className={classes.menu} onClick={toggleDrawer(true)}><Menu className={classes.menuIcon}/></Button>
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

