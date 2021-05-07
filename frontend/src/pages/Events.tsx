import React from 'react';
import Navbar from '../components/Navbar/Navbar'
import AddButton from '../components/AddButton/AddButton'
import classes from '../styles/Events.module.scss';

export default function events() {
    return (
        <div>
            <Navbar />
            <h1>Kudos</h1>
            <AddButton location={"/NewEvent"} />
        </div>
    )
}
