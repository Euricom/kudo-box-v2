import { Ref } from "react";
import classes from './ValidatableInput.module.scss';

interface Props {
    error?: string;
    placeholder?: string;
    autocompleteInputProps?: any;
    autocompleteRef?: Ref<any>;
}

const ValidatableInput = ({ error, placeholder, autocompleteInputProps, autocompleteRef }: Props) => {
    return (
        <div ref={autocompleteRef} className={error ? classes['inputWrapper-error'] : classes.inputWrapper}>
            <input
                type="text"
                placeholder={placeholder ? placeholder : ''}
                className={classes.autocompleteInput}
                {...autocompleteInputProps}
            />
            {error && <span>{error}</span>}
        </div>
    )
}

export default ValidatableInput;