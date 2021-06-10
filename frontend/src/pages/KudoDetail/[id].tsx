import React, { useContext, useEffect, useState } from 'react';
import Drawer from '../../components/Drawer/Drawer'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { DeleteForever } from '@material-ui/icons';
import classes from '../../styles/KudoDetail.module.scss';
import { UserIdContext } from '../../components/AzureAD';
import { useHttpKudoClient } from '../../hooks/clients';
import { DetailedKudo } from '../../domain';
import { useToasts } from 'react-toast-notifications';

export default function Kudos() {
    const [kudo, setKudo] = useState<DetailedKudo>();
    const router = useRouter()
    const { id } = router.query
    const { getKudo, deleteKudo } = useHttpKudoClient();
    const userId = useContext(UserIdContext);
    const { addToast } = useToasts();

    const handleDelete = async () => {
        try {
            if (id) {
                await deleteKudo(id as string);
                router.push('/')
                addToast('Kudo Deleted Successfully', {
                    appearance: 'success',
                    autoDismiss: true,
                    placement: 'top-center'
                });
            }
        } catch (error) {
            addToast('Deleting Kudo Failed', {
                appearance: 'error',
                autoDismiss: true,
                placement: 'top-center'
            });
        }
    }

    const showDelete = () => {
        return userId && kudo &&
            (userId.toUpperCase() === kudo.receiver.id.toUpperCase()
                || userId.toUpperCase() === kudo.sender.id.toUpperCase())
    }

    useEffect(() => {
        (async function () {
            try {
                if (id) setKudo(await getKudo(id as string));
            } catch (error) {
                addToast('Getting Kudo Failed', {
                    appearance: 'error',
                    autoDismiss: true,
                    placement: 'top-center'
                });
            }
        })()
    }, [router.query]);

    return (
        <>
            <Drawer />
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