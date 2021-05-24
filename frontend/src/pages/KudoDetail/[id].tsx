import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar'
import Image from 'next/image'
import axios from '../../services/Axios';
import { useRouter } from 'next/router'
import { DeleteForever } from '@material-ui/icons';
import classes from '../../styles/KudoDetail.module.scss';

interface Kudo {
    Id: string,
    kudoImage: string,
    sendDateTime: Date,
    sender: User,
    receiver: User,
    event?: Event
}

interface User {
    id: string,
    firstName: string,
    lastName: string,
    email: string
}

interface Event {
    id: string,
    title: string,
    isMainEvent: boolean,
    tagName: string
}

export default function Kudos() {

    const router = useRouter()
    const { id } = router.query

    const [Kudo, setKudo] = useState<Kudo>();

    useEffect(() => {
        fetchKudo()
    }, [])

    const fetchKudo = async () => {
        const kudo = await axios.get<Kudo>(
            `/kudo/getOne/${id}`,
            false
        );
        if (kudo) {
            setKudo(kudo.data);
        }
    }

    return (
        <>
            <Navbar />
            <h1>Kudo</h1>
            {Kudo && <div className={classes.kudoHolder}>
                <div className={classes.kudoImageHolder}>
                    <Image src={atob(Kudo.kudoImage)} alt="kudo" layout="fill" />
                    <button
                        className={classes.emojiButton}>
                        <DeleteForever className={classes.icon} />
                    </button>
                </div>
                <div className={classes.infoHolder}>
                    {Kudo.event && <p className={classes.event}>{`${Kudo.event.title} - ${Kudo.event.tagName}`}</p>}
                    <p>{`Sent to: ${Kudo.receiver.firstName} ${Kudo.receiver.lastName}`}</p>
                    <p>{`Send by: ${Kudo.sender.firstName} ${Kudo.sender.lastName}`}</p>
                    <p>{`Send at: ${Kudo.sendDateTime}`}</p>
                </div>
            </div>}
        </>
    )
}