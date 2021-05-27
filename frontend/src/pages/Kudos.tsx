import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar/Navbar'
import AddButton from '../components/AddButton/AddButton'
import KudoList, { Kudo } from '../components/KudoList/KudoList';
import { useRouter } from 'next/router';
import useKudoClient from '../hooks/useKudoClient';

interface Props {
    kudos: Kudo[]
}

export default function Kudos({ }: Props) {
    const [kudos, setKudos] = useState<Kudo[]>([])
    const router = useRouter()
    const { getAllKudos } = useKudoClient();

    useEffect(() => {
        (async function() {
            setKudos(await getAllKudos())
        }) ();
    }, [])

    const handleKudoClick = (id: string) => {
        router.push(`/KudoDetail/${id}`)
    }

    return (
        <>
            <Navbar />
            <h1>Kudos</h1>
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
