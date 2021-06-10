import Drawer from '../components/Drawer/Drawer';
import React, { useState } from 'react';
import PageTab from '../components/PageTab/PageTab';
import { useRouter } from 'next/router'
import { Tabs } from '../components/PageTab/PageTab';
import classes from '../styles/ChooseTheme.module.scss';

export default function ChooseTheme() {

    const [images] = useState(
        ["/bravocado.webp", "/nailed_it.webp", "/teariffic.webp", "/thanks_a_latte.webp", "/you_rock.webp", "/you_got_me_hooker.webp", "/yoda_best.webp"]
    )
    const router = useRouter()

    const handlePic = (image: string) => {
        router.push({
            pathname: '/NewKudo',
            query: { ...router.query, image: image }
        })
    }

    return (
        <>
            <div className={classes.topHolder}>
                <Drawer />
                <h1>Choose Theme</h1>
            </div>

            <div className={classes.scroll}>
                {images.map((image, index) => {
                    return <img key={`${image}.${index}`}
                        onClick={() => handlePic(image)}
                        className={classes.image}
                        src={image}
                        alt="KudoTheme"
                    />
                })}
            </div>
        </>
    )
}