import Image from "next/image"
import { Kudo } from '../KudoList';
import classes from './KudoListItem.module.scss';

interface Props {
    kudo: Kudo;
}

const KudoListItem = ({kudo}: Props) => {
    return (
        <div className={classes.kudo}>
            <Image src={atob(kudo.kudoImage)} layout="fill" />
        </div>
    )
}

export default KudoListItem