import Navbar from '../components/Navbar';
import React, {useState} from 'react';
import CreateKudoBar from '../components/CreateKudoBar';
import Image from 'next/image'
import { useRouter } from 'next/router'
import classes from '../styles/ChooseTheme.module.scss';

export default function ChooseTheme() {

    const [images] = useState(
        ["/bravocado.png", "/nailed_it.png", "/teariffic.png", "/thanks_a_latte.png", "/you_rock.png", "/you_got_me_hooker.png", "/yoda_best.png"]
    )
    const router = useRouter()

    const handlePic = (img) => {
        localStorage.setItem('kudoTheme', img);
        router.push('/NewKudo')
    }

    return (
        <>
            <Navbar />
            <CreateKudoBar tab={2} />
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
