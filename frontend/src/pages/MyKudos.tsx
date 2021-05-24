import { useState } from 'react'
import Navbar from '../components/Navbar/Navbar'
import PageTab, { Tabs } from '../components/PageTab/PageTab'
import { useJwtApiCall } from '../hooks/useJwtApiCall';
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
    const kudos = useJwtApiCall<MyKudos>(getMyKudos)
    const [selectedTab, setSelectedTab] = useState<Tabs>(Tabs.FIRST);

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
        </div>
    )
}

export default MyKudos;
