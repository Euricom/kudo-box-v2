import { ChangeEvent, useState } from "react";
import classes from './IconInput.module.scss';

console.log(classes);

interface Props {
    onChange: (inputText: string) => void;
    renderPreIcon?: () => JSX.Element;
};

const IconInput = ({ onChange, renderPreIcon }: Props) => {
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

export default IconInput;