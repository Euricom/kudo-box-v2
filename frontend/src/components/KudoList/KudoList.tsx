import classes from './KudoList.module.scss';
import KudoListItem from './KudoListItem/KudoListItem';

export interface Kudo {
    id: string;
    kudoImage: string;
}

interface Props {
    kudos: Kudo[]
}

const KudoList = ({ kudos }: Props) => {
    return (
        <div className={classes.kudoList}>
            {kudos.map(k => (
                <KudoListItem kudo={k} key={k.id} />
            ))}
        </div>
    )
}

export default KudoList;