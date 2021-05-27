import { ChangeEvent, useState } from "react";
import classes from './IconInput.module.scss';

console.log(classes);

interface Props {
    onChange: (value: string) => void;
    renderPreIcon?: () => JSX.Element;
};

const TextInput = ({ onChange, renderPreIcon }: Props) => {
    const [value, setValue] = useState<string>();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        onChange(e.target.value);
    }

    return (
        <label className={classes.inputWrapper}>
            {renderPreIcon && renderPreIcon()}
            <input type="text" onChange={handleChange} value={value} />
        </label>
    )
}

export default TextInput;