import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar/Navbar'
import AddButton from '../components/AddButton/AddButton'
import KudoList from '../components/KudoList/KudoList';
import { useRouter } from 'next/router';
import classes from '../styles/Kudos.module.scss';
import SearchIcon from '@material-ui/icons/Search';
import DebouncedSearch from '../components/DebouncedSearch/DebouncedSearch';
import { basicKudo } from '../domain'
import { useKudoClient } from '../hooks/clients'

interface Props {
    kudos: basicKudo[]
}

export default function Kudos({ }: Props) {
    const [kudos, setKudos] = useState<basicKudo[]>([])
    const router = useRouter()
    const { getKudos } = useKudoClient();

    useEffect(() => {
        (async function () {
            setKudos(await getKudos())
        })();
    }, [])

    const handleKudoClick = (id: string) => {
        router.push(`/KudoDetail/${id}`)
    }

    const handleFilterInputChange = async (filterValue: string) => {
        setKudos(await getKudos(filterValue))
    }

    return (
        <>
            <div className={classes.topHolder}>
                <Navbar />
                <h1>Kudos</h1>
                <DebouncedSearch
                    onDebounceComplete={handleFilterInputChange}
                    onDebouncedCanceled={async () => setKudos(await getKudos())}
                    renderPreIcon={() => <SearchIcon />}
                />
            </div>

            <KudoList kudos={kudos} handleKudoClick={handleKudoClick} />
            <AddButton location={"/ChooseTheme"} />
        </>
    )
}

// export async function getStaticProps() {


//     return {
//         props: {
//             kudos: await getAllKudos()
//         } as Props
//     }
// }
