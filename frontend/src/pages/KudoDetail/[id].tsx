import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { DeleteForever } from '@material-ui/icons';
import classes from '../../styles/KudoDetail.module.scss';
import useKudoClient from '../../hooks/useKudoClient';

export interface DetailedKudo {
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
    const [Kudo, setKudo] = useState<DetailedKudo>();
    const router = useRouter()
    const { id } = router.query
    const { getKudo, deleteKudo } = useKudoClient();

    const handleDelete = async () => {
        if (id) {
            await deleteKudo(id as string);
            router.push('/')
        }
    }

    useEffect(() => {
        (async function () {
            if (id) setKudo(await getKudo(id as string));
        })()
    }, []);

    return (
        <>
            <Navbar />
            <h1>Kudo</h1>
            {Kudo && <div className={classes.kudoHolder}>
                <div className={classes.kudoImageHolder}>
                    <Image src={atob(Kudo.kudoImage)} alt="kudo" layout="fill" />
                    <button onClick={handleDelete}
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