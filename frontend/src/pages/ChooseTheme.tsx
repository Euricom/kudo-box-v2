import Navbar from '../components/Navbar';
import React, {useState} from 'react';
import CreateKudoBar from '../components/CreateKudoBar';
import Image from 'next/image'
import { useRouter } from 'next/router'
import { Tabs } from '../components/CreateKudoBar';
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
            <h1 className={classes.title}>Choose Theme</h1>
            <CreateKudoBar tab={Tabs.Kudo} />
            <> 
                {images.map((img, index) => {
                return <div key={`${img}.${index}`} onClick={() => handlePic(img)} className={classes.image}>
                            <Image src={img} alt="kudo" layout="fill" />
                        </div>
                })}
            </>

        </>
    )
}
