import Image from "next/image"
import { MouseEvent } from "react";
import { BasicKudo } from '../../../domain';
import classes from './KudoListItem.module.scss';

interface Props {
    kudo: BasicKudo;
    onClick?: (id: string) => void;
    horizontal: boolean;
}

const KudoListItem = ({kudo, onClick, horizontal = false}: Props) => {
    const handleClick = (_e: MouseEvent<HTMLDivElement>) => {
        onClick && onClick(kudo.id);
    }

    return (
        <div className={`${classes.kudo} ${horizontal ? classes['kudo-horizontal'] : '' }`} onClick={handleClick}>
            <Image src={atob(kudo.kudoImage)} layout="fill" />
        </div>
    )
}

export default KudoListItem