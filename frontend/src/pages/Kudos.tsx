import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar/Navbar'
import AddButton from '../components/AddButton/AddButton'
import Image from 'next/image'
import axios from '../services/Axios';
import classes from '../styles/Kudos.module.scss';

interface Kudo {
    Id: string,
    kudoImage: string
}

export default function Kudos() {
    const [kudos, setKudos] = useState<Kudo[]>([]);

    useEffect(() => {
        fetchKudos()
    }, [])

    const fetchKudos = async () => {
        let fetchedKudos = await axios.get<Kudo[]>(
            '/kudo/getAll',
            false
        );
        if (fetchedKudos) {
           setKudos(fetchedKudos.data)
           console.log(atob(fetchedKudos.data[0].kudoImage))
        }
    }

    return (
        <>
            <Navbar />
            <h1>Kudos</h1>
            <div className={classes.kudoHolder}>
                {kudos.map((kudo, index) => {
                    return <div key={`${kudo.Id}.${index}`} className={classes.kudo}>
                        <Image src={atob(kudo.kudoImage)} alt="kudo" layout="fill" />
                    </div>
                })}
            </div>
            <AddButton location={"/ChooseTheme"} />
        </>
    )
}
