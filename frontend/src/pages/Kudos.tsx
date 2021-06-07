import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar/Navbar'
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
        getAllKudos();
    }, [])

    const getAllKudos = async () => {
        try {
            setKudos(await getKudos())
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

    const handleFilterInputChange = async (filterValue: string) => {
        try {
            setKudos(await getKudos(filterValue))
        } catch (error) {
            addToast('Getting Kudos Failed', {
                appearance: 'error',
                autoDismiss: true,
                placement: 'top-center'
            });
        }
    }

    return (
        <>
            <div className={classes.topHolder}>
                <Navbar />
                <h1>Kudos</h1>
                <DebouncedSearch
                    onDebounceComplete={handleFilterInputChange}
                    onDebouncedCanceled={getAllKudos}
                    renderPreIcon={() => <SearchIcon />}
                />
            </div>

            <KudoList kudos={kudos} handleKudoClick={handleKudoClick} />
            <AddButton location={"/ChooseTheme"} />
        </>
    )
}