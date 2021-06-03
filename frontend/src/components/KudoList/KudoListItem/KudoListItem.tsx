import Image from "next/image"
import { MouseEvent } from "react";
import { BasicKudo } from '../../../domain';
import classes from './KudoListItem.module.scss';

interface Props {
    kudo: BasicKudo;
    onClick?: (id: string) => void;
}

const KudoListItem = ({kudo, onClick}: Props) => {
    const handleClick = (_e: MouseEvent<HTMLDivElement>) => {
        onClick && onClick(kudo.id);
    }

    return (
        <div className={classes.kudo} onClick={handleClick}>
            <Image src={atob(kudo.kudoImage)} layout="fill" />
        </div>
    )
}

export default KudoListItem