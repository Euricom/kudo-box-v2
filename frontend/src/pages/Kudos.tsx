import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar/Navbar'
import AddButton from '../components/AddButton/AddButton'
import KudoList, { Kudo } from '../components/KudoList/KudoList';
import { useRouter } from 'next/router';
import useKudoClient from '../hooks/useKudoClient';
import classes from '../styles/Kudos.module.scss';
import SearchIcon from '@material-ui/icons/Search';
import DebouncedIconInput from '../components/DebouncedIconInput/DebouncedIconInput';

interface Props {
    kudos: Kudo[]
}

export default function Kudos({ }: Props) {
    const [kudos, setKudos] = useState<Kudo[]>([])
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
            <Navbar />
            <h1>Kudos</h1>
            <div className={classes.contentWrapper}>
                <DebouncedIconInput
                    onDebounceComplete={handleFilterInputChange}
                    onDebouncedCanceled={async () => setKudos(await getKudos())}
                    renderPreIcon={() => <SearchIcon />}
                />
                <KudoList kudos={kudos} handleKudoClick={handleKudoClick} />
                <AddButton location={"/ChooseTheme"} />
            </div>
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
