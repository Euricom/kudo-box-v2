import { TextField } from "@material-ui/core";
import { Autocomplete, AutocompleteChangeReason, AutocompleteInputChangeReason } from "@material-ui/lab";
import axios from '../../services/Axios';
import React, { ChangeEvent, ChangeEventHandler, FC, ReactElement, ReactHTMLElement, ReactNode, SetStateAction, useRef, useState } from "react";
import useDebounce from "../../hooks/useDebounce";
import classes from './DebounceTextInput.module.scss';

interface TagEvent {
    eventId: string;
    eventTitle: string;
    tagName: string;
}

const DebounceTextInput = ({textInput}: Props) => {
    const [value, setValue] = useState<TagEvent | null>(null);
    const [inputValue, setInputvalue] = useState<string>('');
    const [options, setOptions] = useState<TagEvent[]>([]);
    const { debouncedFn, cancelDebounce } = useDebounce((value: string) => getTagEvents(value), 800)

    const handleValueChange = (e: ChangeEvent<any>, value: TagEvent | null, reason: AutocompleteChangeReason) => {
        console.log(value);
        setValue(value);
    }

    const handleInputChange = (e: ChangeEvent<any>, value: string, reason: AutocompleteInputChangeReason) => {
        setInputvalue(value);
        if(!(!!value)) {
            setOptions([]);
            cancelDebounce();
        } 
        else debouncedFn(value);
    }

    const getTagEvents = async (value: string) => {
        const response = (await axios.get<TagEvent[]>('tag/with-owner-event'));
        if(!response) return;
        setOptions(response.data);
    } 

    return (
        <Autocomplete 
            value={value}
            onChange={handleValueChange}
            inputValue={inputValue}
            onInputChange={handleInputChange}
            options={options}
            getOptionLabel={(option) => option.tagName}
            renderInput={(params) => 
                <div ref={params.InputProps.ref}>
                    <input type="text" placeholder="Tags" className={classes.tags} {...params.inputProps} />
                </div>
        }
            // renderInput={(params) => React.cloneElement(textInput, {...params})}
        />
    )
}

export default DebounceTextInput;