import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar/Navbar'
import AddButton from '../components/AddButton/AddButton'
import Image from 'next/image'
import axios from '../services/Axios';
import classes from '../styles/Kudos.module.scss';

export default function Kudos() {
    const [kudos, setKudos] = useState([{ kudo: '/bravocado.png', to: 'jerry', tags: ['devcruse2020', 'vue.js'] }]);

    return (
        <>
            <Navbar />
            <h1>Kudos</h1>
            <div className={classes.kudoHolder}>
                {kudos.map((kudo, index) => {
                    return <div key={`${kudo.kudo}.${index}`} className={classes.kudo}>
                        <Image src={kudo.kudo} alt="kudo" layout="fill" />
                    </div>
                })}
            </div>
            <AddButton location={"/ChooseTheme"} />
        </>
    )
}
