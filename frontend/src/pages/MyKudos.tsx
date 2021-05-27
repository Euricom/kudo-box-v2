import { useEffect, useState } from 'react'
import KudoList from '../components/KudoList/KudoList';
import Navbar from '../components/Navbar/Navbar'
import PageTab, { Tabs } from '../components/PageTab/PageTab'
import { useUserClient } from '../hooks/useUserClient';

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
    const [myKudos, setMyKudos] = useState<MyKudos | undefined>(undefined)
    const [selectedTab, setSelectedTab] = useState<Tabs>(Tabs.FIRST);
    const [kudosToShow, setKudosToShow] = useState<Kudo[]>([]);

    useEffect(() => {
        // Immediately Invoked Function Expression (IIFE)
        (async function() {
            setMyKudos(await getMyKudos())
        }) ();
    }, [])

    useEffect(() => {
        setKudosToShow(getKudosToShow());
    }, [myKudos, selectedTab])

    const handleTabChange = (tab: Tabs) => {
        setSelectedTab(tab);
    }

    const getKudosToShow = (): Kudo[] => {
        if (!myKudos) return [];
        if (selectedTab === Tabs.FIRST) return myKudos.receivedKudos;
        return myKudos.sentKudos;
    }

    return (
        <div>
            <Navbar />
            <h1>My Kudos</h1>
            <PageTab
                firstTab={{ text: 'Received' }}
                secondTab={{ text: 'Sent' }}
                isRouting={false}
                selectedTab={selectedTab}
                onTabChange={handleTabChange}
            />
            <KudoList kudos={kudosToShow} />
        </div>
    )
}

export default MyKudos;
