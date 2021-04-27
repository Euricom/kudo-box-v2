import Navbar from '../components/navbar';
import React from 'react';
import CreateKudoBar from '../components/createKudoBar';
import Image from 'next/image'
import { useRouter } from 'next/router'
import classes from '../styles/ChooseTheme.module.scss';

export default function ChooseTheme() {

    const [images] = React.useState(
        ["/bravocado.png", "/nailed_it.png", "/teariffic.png", "/thanks_a_latte.png", "/you_rock.png", "/you_got_me_hooker.png", "/yoda_best.png"]
    )
    const router = useRouter()

    function handlePic(img) {
        localStorage.setItem('kudoTheme', img);
        router.push('/NewKudo')
    }

    return (
        <div>
            <Navbar />
            <CreateKudoBar tab={2} />
            <div> {images.map(img => {
                return <div onClick={() => handlePic(img)} className={classes.image}>
                    <Image src={img} alt="kudo" layout="fill" />
                </div>
            })}</div>

        </div>
    )
}
