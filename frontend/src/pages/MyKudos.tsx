import { useEffect, useState } from 'react'
import KudoList from '../components/KudoList/KudoList';
import Navbar from '../components/Navbar/Navbar'
import PageTab, { Tabs } from '../components/PageTab/PageTab'
import { useUserClient } from '../hooks/useUserClient';
import { useRouter } from 'next/router';
import classes from '../styles/myKudos.module.scss';

interface Kudo {
    id: string;
    kudoImage: string;
}

export interface MyKudos {
    receivedKudos: Kudo[];
    sentKudos: Kudo[];
}

const MyKudos = () => {
    const { getMyKudos } = useUserClient();
    const router = useRouter()
    const [myKudos, setMyKudos] = useState<MyKudos | undefined>(undefined)
    const [selectedTab, setSelectedTab] = useState<Tabs>(Tabs.FIRST);
    const [kudosToShow, setKudosToShow] = useState<Kudo[]>([]);

    useEffect(() => {
        // Immediately Invoked Function Expression (IIFE)
        (async function () {
            setMyKudos(await getMyKudos())
        })();
    }, [])

    useEffect(() => {
        setKudosToShow(getKudosToShow());
    }, [myKudos, selectedTab])

    const handleTabChange = (tab: Tabs) => {
        setSelectedTab(tab);
    }

    const handleKudoClick = (id: string) => {
        router.push(`/KudoDetail/${id}`)
    }

    const getKudosToShow = (): Kudo[] => {
        if (!myKudos) return [];
        if (selectedTab === Tabs.FIRST) return myKudos.receivedKudos;
        return myKudos.sentKudos;
    }

    return (
        <>
            <div className={classes.topHolder}>
                <Navbar />
                <h1>My Kudos</h1>
                <PageTab
                    firstTab={{ text: 'Received' }}
                    secondTab={{ text: 'Sent' }}
                    isRouting={false}
                    selectedTab={selectedTab}
                    onTabChange={handleTabChange}
                />
            </div>
            <KudoList kudos={kudosToShow} handleKudoClick={handleKudoClick} />
        </>
    )
}

export default MyKudos;
