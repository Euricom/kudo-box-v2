import Link from 'next/link'
import React, { KeyboardEvent, MouseEvent, useState } from 'react';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import { Menu, EmojiEvents, HomeOutlined, Redeem, CardMembership, AddCircle, ExitToApp } from '@material-ui/icons';

import classes from './Navbar.module.scss';
import { useMsal } from '@azure/msal-react';

export default function Navbar() {
    const [state, setState] = useState(false);
    const { instance } = useMsal();

    const toggleDrawer = (newState: boolean) => {
        return (event: KeyboardEvent | MouseEvent) => {
            if (
                event.type === 'keydown' &&
                ((event as KeyboardEvent).key === 'Tab' ||
                    (event as KeyboardEvent).key === 'Shift')
            ) {
                return;
            }
            setState(newState);
        }
    };

    const logOut = async () => {
        await instance.logoutRedirect();
    }

    const list = () => (
        <div
            className={classes.navbar}
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <h2>Kudos</h2>
            <div className={classes.listItemWrapper}>
                <div>
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
                </div>
                <div>
                    <ListItem className={classes.listItem} button >
                        <ExitToApp className={classes.icon} />
                        <a onClick={logOut}>Log out</a>
                    </ListItem>
                </div>
            </div>
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

