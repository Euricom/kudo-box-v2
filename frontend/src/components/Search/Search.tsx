import { ChangeEvent, useState } from "react";
import classes from './Search.module.scss';

interface Props {
    onChange: (inputText: string) => void;
    renderPreIcon?: () => JSX.Element;
};

const Search = ({ onChange, renderPreIcon }: Props) => {
    const [inputText, setInputText] = useState<string>();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputText(e.target.value);
        onChange(e.target.value);
    }

    return (
        <label className={classes.inputWrapper}>
            {renderPreIcon && renderPreIcon()}
            <input type="text" onChange={handleChange} value={inputText} />
        </label>
    )
}

export default Search;