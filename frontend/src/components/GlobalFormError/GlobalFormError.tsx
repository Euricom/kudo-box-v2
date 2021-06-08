import { HighlightOff } from "@material-ui/icons"
import classes from './GlobalFormError.module.scss';

interface Props {
    errors: string[]
}

const GlobalFormError = ({errors}: Props) => {
    const renderErrorList = () => {
        return (
            <ul>
                {errors.map((e) => <li>e</li>)}
            </ul>
        )
    }

    return (
        <div className={classes.globalFormWrapper}>
            <div>
                <span>Something is not right!</span>
                {renderErrorList()}
            </div>
            <div><HighlightOff fontSize="large" /></div>
        </div>
    )
}

export default GlobalFormError;