import { ChangeEvent, Ref } from "react";
import classes from './ValidatableInput.module.scss';

interface Props {
    error?: string;
    placeholder?: string;
    value?: string;
    onChange?: (text: string) => void;
    autocompleteInputProps?: any;
    autocompleteRef?: Ref<any>;
}

const ValidatableInput = ({ value, onChange, error, placeholder, autocompleteInputProps, autocompleteRef }: Props) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if(onChange) return onChange(e.target.value);
    }

    return (
        <div ref={autocompleteRef} className={error ? classes['inputWrapper-error'] : classes.inputWrapper}>
            <input
                type="text"
                value={value}
                onChange={handleChange}
                placeholder={placeholder ? placeholder : ''}
                className={classes.autocompleteInput}
                {...autocompleteInputProps}
            />
            {error && <span>{error}</span>}
        </div>
    )
}

export default ValidatableInput;