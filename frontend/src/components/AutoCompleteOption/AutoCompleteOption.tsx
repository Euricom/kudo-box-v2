import { Divider } from "@material-ui/core";
import classes from "./AutoCompleteOption.module.scss";

interface Props {
    mainText: string,
    subText?: string,
    isLast?: boolean
}

const AutoCompleteOption = ({ mainText, subText, isLast = false }: Props) => {
    return (
        <div className={classes.optionContainer}>
            <span className={classes.main}>{mainText}</span>
            {subText && <span className={classes.sub}>#{subText}</span>}
        </div>
    );
}

export default AutoCompleteOption;