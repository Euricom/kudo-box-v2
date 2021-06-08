import Navbar from '../components/Navbar/Navbar';
import React, { useState } from 'react';
import PageTab from '../components/PageTab/PageTab';
import { useRouter } from 'next/router'
import { Tabs } from '../components/PageTab/PageTab';
import classes from '../styles/ChooseTheme.module.scss';

interface Props {
    images: string[]
}

export default function ChooseTheme({ images }: Props) {
    const router = useRouter()

    const handlePic = (img: string) => {
        router.push({
            pathname: '/NewKudo',
            query: { ...router.query, image: img }
        })
    }

    return (
        <>
            <div className={classes.topHolder}>
                <Navbar />
                <h1>Choose Theme</h1>
                <PageTab
                    isRouting={true}
                    firstTab={{ text: 'Scan', href: '/ScanKudo' }}
                    secondTab={{ text: 'Create', href: '/ChooseTheme' }}
                    selectedTab={Tabs.SECOND}
                />
            </div>

            <div className={classes.scroll}>
                {images.map((img, index) => {
                    return <img key={`${img}.${index}`}
                        onClick={() => handlePic(img)}
                        className={classes.image}
                        src={img}
                        alt='KudoTheme'
                    />
                })}
            </div>
        </>
    )
}

export async function getStaticProps() {
    return {
        props: { images: ['/bravocado.webp', '/nailed_it.webp', '/teariffic.webp', '/thanks_a_latte.webp', '/you_rock.webp', '/you_got_me_hooker.webp', '/yoda_best.webp'] } as Props
    };
}
