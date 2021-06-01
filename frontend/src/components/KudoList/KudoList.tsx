import classes from './KudoList.module.scss';
import KudoListItem from './KudoListItem/KudoListItem';

import { Kudo } from '../../domain'

interface Props {
    kudos: Kudo[];
    handleKudoClick?: (id: string) => void;
}

const KudoList = ({ kudos, handleKudoClick }: Props) => {
    return (
        <div className={classes.kudoList}>
            {kudos.map(k => (
                <KudoListItem kudo={k} key={k.id} onClick={handleKudoClick} />
            ))}
        </div>
    )
}

export default KudoList;