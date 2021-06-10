import Drawer from '../components/Drawer/Drawer';
import React from 'react';
import { useRouter } from 'next/router'
import classes from '../styles/ChooseTheme.module.scss';

interface Props {
    images: string[]
}

export default function ChooseTheme({ images }: Props) {
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
