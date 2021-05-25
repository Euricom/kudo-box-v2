import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar/Navbar'
import AddButton from '../components/AddButton/AddButton'
import axios from '../services/Axios';
import KudoList, { Kudo } from '../components/KudoList/KudoList';

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
            console.log(fetchedKudos.data);
        }
    }

    return (
        <>
            <Navbar />
            <h1>Kudos</h1>
            <KudoList kudos={kudos} />
            <AddButton location={"/ChooseTheme"} />
        </>
    )
}
