import React, { useEffect, useState } from 'react';
import Drawer from '../components/Drawer/Drawer'
import AddButton from '../components/AddButton/AddButton'
import KudoList from '../components/KudoList/KudoList';
import { useRouter } from 'next/router';
import classes from '../styles/Kudos.module.scss';
import SearchIcon from '@material-ui/icons/Search';
import DebouncedSearch from '../components/DebouncedSearch/DebouncedSearch';
import { BasicKudo } from '../domain'
import { useHttpKudoClient } from '../hooks/clients'
import { useToasts } from 'react-toast-notifications';

export default function Kudos() {
    const [kudos, setKudos] = useState<BasicKudo[]>([])
    const router = useRouter()
    const { getKudos } = useHttpKudoClient();
    const { addToast } = useToasts();

    useEffect(() => {
        fetchKudos();
    }, [])

    const fetchKudos = async (filterValue?: string) => {
        try {
            if (filterValue) {
                setKudos(await getKudos(filterValue))
            }else{
                setKudos(await getKudos())
            }

        } catch (error) {
            addToast('Getting Kudos Failed', {
                appearance: 'error',
                autoDismiss: true,
                placement: 'top-center'
            });
        }
    }

    const handleKudoClick = (id: string) => {
        router.push(`/KudoDetail/${id}`)
    }

    return (
        <>
            <div className={classes.topHolder}>
                <Drawer />
                <h1>Kudos</h1>
                <DebouncedSearch
                    onDebounceComplete={fetchKudos}
                    onDebouncedCanceled={fetchKudos}
                    renderPreIcon={() => <SearchIcon />}
                />
            </div>

            <KudoList kudos={kudos} handleKudoClick={handleKudoClick} />
            <AddButton location={"/ChooseTheme"} />
        </>
    )
}