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

interface Props {
    kudos: BasicKudo[]
}

export default function Kudos({ }: Props) {
    const [kudos, setKudos] = useState<BasicKudo[]>([])
    const router = useRouter()
    const { getKudos } = useHttpKudoClient();

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
                <Drawer />
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
