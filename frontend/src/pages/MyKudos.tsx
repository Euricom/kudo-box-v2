import Image from 'next/image';
import { useEffect, useState } from 'react'
import KudoList from '../components/KudoList/KudoList';
import Navbar from '../components/Navbar/Navbar'
import PageTab, { Tabs } from '../components/PageTab/PageTab'
import { useJwtApiGetCall } from '../hooks/useJwtApiCall';
import axios from '../services/Axios';

interface Kudo {
    id: string;
    kudoImage: string;
}

interface MyKudos {
    receivedKudos: Kudo[];
    sentKudos: Kudo[];
}

const MyKudos = () => {
    const myKudos = useJwtApiGetCall<MyKudos>('/user/me/kudos', getMyKudos)
    const [selectedTab, setSelectedTab] = useState<Tabs>(Tabs.FIRST);
    const [kudosToShow, setKudosToShow] = useState<Kudo[]>([]);

    useEffect(() => {
        console.log(myKudos);
        console.log(getKudosToShow());
        setKudosToShow(getKudosToShow());
    }, [myKudos, selectedTab])

    const handleTabChange = (tab: Tabs) => {
        setSelectedTab(tab);
    }

    async function getMyKudos (jwt: string): Promise<MyKudos | undefined> {
        const headers = {
            Authorization: `Bearer ${jwt}`
        }

        const response = await axios.get<MyKudos>('/user/me/kudos', headers)
        if(response) return response.data;
    }

    const getKudosToShow = (): Kudo[] => {
        if(!myKudos) return [];
        if(selectedTab === Tabs.FIRST) return myKudos.receivedKudos;
        return myKudos.sentKudos;
    }

    return (
        <div>
            <Navbar />
            <PageTab 
                firstText="received"
                secondText="sent"
                isRouting={false}
                selectedTab={selectedTab}
                onTabChange={handleTabChange}
            />
            <div>
                <KudoList kudos={kudosToShow} />
            </div>
        </div>
    )
}

export default MyKudos;
