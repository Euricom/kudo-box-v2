import classes from './KudoList.module.scss';
import KudoListItem from './KudoListItem/KudoListItem';

import { BasicKudo } from '../../domain'
import { UIEvent, useEffect } from 'react';

interface Props {
    kudos: BasicKudo[];
    handleKudoClick?: (id: string) => void;
    horizontal?: boolean;
}

const KudoList = ({ kudos, handleKudoClick, horizontal = false }: Props) => {
    const handleScroll = (e: UIEvent<HTMLDivElement>) => {
        e.preventDefault();
    }

    return (
        <div className={horizontal ? classes['kudoList-horizontal'] : classes.kudoList} onScroll={handleScroll}>
            {kudos.map(k => (
                <KudoListItem kudo={k} key={k.id} onClick={handleKudoClick} horizontal={horizontal} />
            ))}
        </div>
    )
}

export default KudoList;