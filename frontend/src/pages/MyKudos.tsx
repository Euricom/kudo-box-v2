import { useEffect, useState } from 'react'
import KudoList from '../components/KudoList/KudoList';
import Drawer from '../components/Drawer/Drawer'
import PageTab, { Tabs } from '../components/PageTab/PageTab'
import { useRouter } from 'next/router';
import classes from '../styles/myKudos.module.scss';
import { BasicKudo } from '../domain'
import { useHttpUserClient } from '../hooks/clients'

export interface MyKudos {
    receivedKudos: BasicKudo[];
    sentKudos: BasicKudo[];
}

const MyKudos = () => {
    const { getMyKudos } = useHttpUserClient();
    const router = useRouter()
    const [myKudos, setMyKudos] = useState<MyKudos | undefined>(undefined)
    const [selectedTab, setSelectedTab] = useState<Tabs>(Tabs.FIRST);
    const [kudosToShow, setKudosToShow] = useState<BasicKudo[]>([]);

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

    const getKudosToShow = (): BasicKudo[] => {
        if (!myKudos) return [];
        if (selectedTab === Tabs.FIRST) return myKudos.receivedKudos;
        return myKudos.sentKudos;
    }

    return (
        <>
            <div className={classes.topHolder}>
                <Drawer />
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
