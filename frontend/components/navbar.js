import Link from 'next/link'
import React from 'react';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import { EmojiEvents, HomeOutlined, Redeem, CardMembership, AddCircle } from '@material-ui/icons';

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
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <ListItem button >
                <HomeOutlined />
                <Link href="/">
                    <a>Home</a>
                </Link>
            </ListItem>
            <ListItem button >
                <EmojiEvents />
                <Link href="/Events">
                    <a>Events</a>
                </Link>
            </ListItem>
            <ListItem button >
                <Redeem />
                <Link href="/Kudos">
                    <a>Kudos</a>
                </Link>
            </ListItem>
            <ListItem button >
                <CardMembership />
                <Link href="/MyKudos">
                    <a>My Kudos</a>
                </Link>
            </ListItem>
            <ListItem button >
                <AddCircle />
                <Link href="/NewKudo">
                    <a>New Kudo</a>
                </Link>
            </ListItem>
        </div >
    );

    return (
        <div>
            <Button onClick={toggleDrawer(true)}>{'burger'}</Button>
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
