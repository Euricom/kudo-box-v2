import Image from 'next/image';
import { useEffect, useState } from 'react'
import useSWR from 'swr';
import KudoList from '../components/KudoList/KudoList';
import Navbar from '../components/Navbar/Navbar'
import PageTab, { Tabs } from '../components/PageTab/PageTab'
import { useCachedGetApiCall } from '../hooks/useCachedGetApiCall';
import { useUserClient } from '../hooks/useUserClient';
import axios from '../services/Axios';

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

    // async function getMyKudos(jwt: string): Promise<MyKudos | undefined> {
    //     const headers = {
    //         Authorization: `Bearer ${jwt}`
    //     }

    //     const response = await axios.get<MyKudos>('/user/me/kudos', headers)
    //     if (response) return response.data;
    // }

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
