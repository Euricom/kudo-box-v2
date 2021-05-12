import { Divider } from "@material-ui/core";
import classes from "./Option.module.scss";

interface Props {
    mainText: string,
    subText: string,
    isLast?: boolean
}

const Option = ({ mainText, subText, isLast = false }: Props) => {
    return (
        <div className={classes.optionContainer}>
            <span className={classes.main}>{mainText}</span>
            <span className={classes.sub}>#{subText}</span>
        </div>
    );
}

export default Option;