import { HighlightOff } from "@material-ui/icons"
import { useEffect, useState } from "react";
import classes from './GlobalFormError.module.scss';

interface Props {
    errors: string[]
}

const GlobalFormError = ({ errors }: Props) => {
    const [visible, setVisible] = useState<boolean>(true)

    useEffect(() => {
        if(errors && errors.length > 0) setVisible(true);
    }, [errors])

    const handleCloseClick = () => {
        setVisible(false);
    }

    const renderErrorList = () => {
        return (
            <ul>
                {errors.map((e) => <li>{e}</li>)}
            </ul>
        )
    }

    return (
        <>
            {visible &&
                <div className={classes.globalFormWrapper}>
                    <div>
                        <span>Something is not right!</span>
                        {renderErrorList()}
                    </div>
                    <div onClick={handleCloseClick}>
                        <HighlightOff fontSize="large" />
                    </div>
                </div>
            }
        </>
    )
}

export default GlobalFormError;