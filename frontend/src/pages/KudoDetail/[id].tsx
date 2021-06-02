import React, { useContext, useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { DeleteForever } from '@material-ui/icons';
import classes from '../../styles/KudoDetail.module.scss';
import { UserIdContext } from '../../components/AzureAD';
import { useKudoClient } from '../../hooks/clients'
import { User } from '../../domain'
 
interface DetailedKudo {
    Id: string,
    kudoImage: string,
    sendDateTime: Date,
    sender: User,
    receiver: User,
    event?: Event
}

interface Event {
    id: string,
    title: string,
    isMainEvent: boolean,
    tagName: string
}

export default function Kudos() {
    const [kudo, setKudo] = useState<DetailedKudo>();
    const router = useRouter()
    const { id } = router.query
    const { getKudo, deleteKudo } = useKudoClient();
    const userId = useContext(UserIdContext);

    const handleDelete = async () => {
        if (id) {
            await deleteKudo(id as string);
            router.push('/')
        }
    }

    const showDelete = () => {
        return userId && kudo &&
            (userId.toUpperCase() === kudo.receiver.id.toUpperCase()
                || userId.toUpperCase() === kudo.sender.id.toUpperCase())
    }

    useEffect(() => {
        (async function () {
            if (id) setKudo(await getKudo(id as string));
        })()
    }, [router.query]);

    return (
        <>
            <Navbar />
            <h1>Kudo</h1>
            {kudo && <div className={classes.kudoHolder}>
                <div className={classes.kudoImageHolder}>
                    <Image src={atob(kudo.kudoImage)} alt="kudo" layout="fill" />
                    {showDelete() && <button onClick={handleDelete}
                        className={classes.emojiButton}>
                        <DeleteForever className={classes.icon} />
                    </button>
                    }

                </div>
                <div className={classes.infoHolder}>
                    {kudo.event && <p className={classes.event}>{`${kudo.event.title} - ${kudo.event.tagName}`}</p>}
                    <p>{`Sent to: ${kudo.receiver.firstName} ${kudo.receiver.lastName}`}</p>
                    <p>{`Send by: ${kudo.sender.firstName} ${kudo.sender.lastName}`}</p>
                    <p>{`Send at: ${kudo.sendDateTime}`}</p>
                </div>
            </div>}
        </>
    )
}