import { ChangeEvent, useState } from "react";
import classes from './Search.module.scss';

interface Props {
    onChange?: (inputText: string) => void;
    renderPreIcon?: () => JSX.Element;
    autocompleteInputProps?: any;
};

const Search = ({ onChange, renderPreIcon, autocompleteInputProps: inputProps }: Props) => {
    const [inputText, setInputText] = useState<string>();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputText(e.target.value);
        if(onChange) onChange(e.target.value);
    }

    return (
        <label className={classes.inputWrapper}>
            {renderPreIcon && renderPreIcon()}
            <input type="text" onChange={handleChange} value={inputText} {...inputProps} />
        </label>
    )
}

export default Search;