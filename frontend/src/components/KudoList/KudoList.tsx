import classes from './KudoList.module.scss';
import KudoListItem from './KudoListItem/KudoListItem';

import { BasicKudo } from '../../domain'
import { UIEvent, useRef, WheelEvent } from 'react';

interface Props {
    kudos: BasicKudo[];
    handleKudoClick?: (id: string) => void;
    horizontal?: boolean;
}

const KudoList = ({ kudos, handleKudoClick, horizontal = false }: Props) => {

    const target = useRef<HTMLDivElement>(null);

    const handleScroll = (event: WheelEvent<HTMLDivElement>) => {
        if (target.current) {
            const toLeft = event.deltaY < 0 && target.current.scrollLeft > 0
            const toRight = event.deltaY > 0 && target.current.scrollLeft < target.current.scrollWidth - target.current.clientWidth

            if (toLeft || toRight) {
                event.preventDefault()
                target.current.scrollLeft += event.deltaY
            }
        }
    }

    return (
        <div className={horizontal ? classes['kudoList-horizontal'] : classes.kudoList} ref={target} onWheel={handleScroll}>
            {kudos.map(k => (
                <KudoListItem kudo={k} key={k.id} onClick={handleKudoClick} horizontal={horizontal} />
            ))}
        </div>
    )
}

export default KudoList;