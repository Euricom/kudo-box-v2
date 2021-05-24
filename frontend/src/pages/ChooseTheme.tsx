import Navbar from '../components/Navbar/Navbar';
import React, { useState } from 'react';
import PageTab from '../components/PageTab/PageTab';
import Image from 'next/image'
import { useRouter } from 'next/router'
import { Tabs } from '../components/PageTab/PageTab';
import classes from '../styles/ChooseTheme.module.scss';

export default function ChooseTheme() {

    const [images] = useState(
        ["/bravocado.png", "/nailed_it.png", "/teariffic.png", "/thanks_a_latte.png", "/you_rock.png", "/you_got_me_hooker.png", "/yoda_best.png"]
    )
    const router = useRouter()

    const handlePic = (img: string) => {
        localStorage.setItem('kudoTheme', img);
        router.push('/NewKudo')
    }

    return (
        <>
            <Navbar />
            <h1>Choose Theme</h1>
            <PageTab isRouting={true} firstText="Scan" secondText="Create" selectedTab={Tabs.SECOND} />
            <div className={classes.scroll}>
                {images.map((img, index) => {
                    return <div key={`${img}.${index}`} onClick={() => handlePic(img)} className={classes.image}>
                               <Image src={img} alt="kudo" layout="fill" />
                           </div>
                })}
            </div>
        </>
    )
}
