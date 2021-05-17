import { Autocomplete, AutocompleteChangeReason, AutocompleteInputChangeReason } from "@material-ui/lab";
import React, { ChangeEvent, useState } from "react";
import useDebounce from "../../hooks/useDebounce";
import classes from './DebounceTextInput.module.scss';
import AutoCompleteOption from './AutoCompleteOption/AutoCompleteOption';

export interface Option {
    id: string;
    mainText: string;
    subText: string;
}

interface Props {
    options: Option[];
    selectedOption: Option | null;
    onDebounceComplete: (value: string) => void;
    onDebounceCancel: () => void;
    onSelectChange: (value: Option | null) => void;
}

const DebounceTextInput = ({ options, selectedOption, onDebounceComplete, onDebounceCancel, onSelectChange }: Props) => {
    const [inputValue, setInputvalue] = useState<string>('');
    const { debouncedFn, cancelDebounce } = useDebounce((inputValue: string) => onDebounceComplete(inputValue), 800);

    const handleInputChange = (_e: ChangeEvent<any>, value: string, _reason: AutocompleteInputChangeReason) => {
        setInputvalue(value);
        if(value) debouncedFn(value);
        else {
            cancelDebounce();
            onDebounceCancel()
        }
    }

    const handleChange = (_e: ChangeEvent<any>, value: Option | null, _reason: AutocompleteChangeReason) => {
        onSelectChange(value);
    }

    return (
        <Autocomplete
            value={selectedOption}
            onChange={handleChange}
            inputValue={inputValue}
            onInputChange={handleInputChange}
            options={options}
            renderOption={(option) => <AutoCompleteOption mainText={option.mainText} subText={option.subText} />}
            getOptionLabel={(option) => option.mainText}
            getOptionSelected={(option, _value) => option.id === selectedOption?.id}
            renderInput={(params) =>
                <div ref={params.InputProps.ref}>
                    <input type="text" placeholder="Tags" className={classes.tags} {...params.inputProps} />
                </div>
            }
            debug={true}
        />
    )
}

export default DebounceTextInput;