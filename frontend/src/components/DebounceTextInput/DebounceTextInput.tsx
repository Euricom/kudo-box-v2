import { Autocomplete, AutocompleteChangeReason, AutocompleteInputChangeReason, AutocompleteRenderInputParams } from "@material-ui/lab";
import React, { ChangeEvent, useState } from "react";
import useDebounce from "../../hooks/useDebounce";
import classes from './DebounceTextInput.module.scss';
import AutoCompleteOption from '../AutoCompleteOption/AutoCompleteOption';
import { Properties } from 'csstype';

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
    renderOption: (option: Option) => JSX.Element;
    renderInput: (params: AutocompleteRenderInputParams) => JSX.Element
}

const DebounceTextInput = ({ options, selectedOption, onDebounceComplete, onDebounceCancel, onSelectChange, renderOption, renderInput }: Props) => {
    const [inputValue, setInputValue] = useState<string>('');
    const { debouncedFn, cancelDebounce } = useDebounce((inputValue: string) => onDebounceComplete(inputValue), 800);

    const handleInputChange = (_e: ChangeEvent<any>, value: string, _reason: AutocompleteInputChangeReason) => {
        setInputValue(value);

        if (value) return debouncedFn(value);

        cancelDebounce();
        return onDebounceCancel();
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
            renderOption={renderOption}
            getOptionLabel={(option) => option.mainText}
            getOptionSelected={(option, _value) => option.id === selectedOption?.id}
            renderInput={renderInput}
            classes={{ input: classes.autoCompleteInput }}
            debug={true}
        />
    )
}

export default DebounceTextInput;