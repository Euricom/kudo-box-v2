import classes from './KudoList.module.scss';
import KudoListItem from './KudoListItem/KudoListItem';

import { BasicKudo } from '../../domain'
import { useRef, useEffect, useState, WheelEvent } from 'react';

interface Props {
    kudos: BasicKudo[];
    handleKudoClick?: (id: string) => void;
    horizontal?: boolean;
    animateKudos?: boolean;
}

const KudoList = ({ kudos, handleKudoClick, horizontal = false, animateKudos = false }: Props) => {

    const [animationTrigger, setAnimationTrigger] = useState<boolean>(false);
    // const [loaded, setLoaded] = useState<boolean>(false);

    useEffect(() => {
        if (animateKudos) setAnimationTrigger(true)
    }, [kudos])

    const onAnimationEnd = () => {
        setAnimationTrigger(false)
    }

    const target = useRef<HTMLDivElement>(null);

    const handleScroll = (event: WheelEvent<HTMLDivElement>) => {
        if (target.current) {
            const toLeft = event.deltaY < 0 && target.current.scrollLeft > 0
            const toRight = event.deltaY > 0 && target.current.scrollLeft < target.current.scrollWidth - target.current.clientWidth

            if (toLeft || toRight) {
                target.current.scrollLeft += event.deltaY
            }
        }
    }

    return (
        <div className={horizontal ? (animationTrigger ? `${classes['kudoList-horizontal']} ${classes['kudoList-animate']}` : classes['kudoList-horizontal']) : classes.kudoList}
            ref={target}
            onWheel={handleScroll}
            onAnimationEnd={onAnimationEnd}>
            {kudos.map(k => (
                <KudoListItem kudo={k} key={k.id} onClick={handleKudoClick} horizontal={horizontal} />
            ))}
        </div>
    )
}

export default KudoList;