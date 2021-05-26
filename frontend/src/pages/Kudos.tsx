import React from 'react';
import Navbar from '../components/Navbar/Navbar'
import AddButton from '../components/AddButton/AddButton'
import Image from 'next/image'
import axios from '../services/Axios';
import { useRouter } from 'next/router'
import classes from '../styles/Kudos.module.scss';

interface Kudo {
    Id: string,
    kudoImage: string
}

interface Props {
    kudos: Kudo[]
}

export default function Kudos({ kudos }: Props) {
    const router = useRouter()

    const handleKudoClick = (id: string) => {
        router.push(`/KudoDetail/${id}`)
    }

    return (
        <>
            <div className={classes.navHolder}>
                <Navbar />
                <h1>Kudos</h1>
            </div>

            <div className={classes.kudoHolder}>
                {kudos.map((kudo, index) => {
                    return <div key={`${kudo.Id}.${index}`} onClick={() => handleKudoClick(kudo.Id)} className={classes.kudo}>
                        <Image src={atob(kudo.kudoImage)} alt="kudo" layout="fill" />
                    </div>
                })}
            </div>
            <AddButton location={"/ChooseTheme"} />
        </>
    )
}

export async function getStaticProps() {
    const kudos = await axios.get<Kudo[]>(
        '/kudo/getAll',
        false
    );
    if (kudos) {
        return {
            props: { kudos: kudos.data } as Props
        }
    }
    return { props: { kudos: [] } as Props };
}
