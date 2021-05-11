import { TextField } from "@material-ui/core";
import { Autocomplete, AutocompleteChangeReason, AutocompleteInputChangeReason } from "@material-ui/lab";
import axios from '../../services/Axios';
import { ChangeEvent, ChangeEventHandler, FC, SetStateAction, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce/lib";
import useDebounce from "../../hooks/useDebounce";

interface TagEvent {
    eventId: string;
    eventTitle: string;
    tagName: string;
}

const DebounceTextInput = ({}) => {
    const [value, setValue] = useState<TagEvent | null>(null);
    const [inputValue, setInputvalue] = useState<string>('');
    const [options, setOptions] = useState<TagEvent[]>([]);
    const debounce = useDebounce((value: string) => getTagEvents(value), 500)

    const handleValueChange = (e: ChangeEvent<any>, value: TagEvent | null, reason: AutocompleteChangeReason) => {
        setValue(value);
    }

    const handleInputChange = (e: ChangeEvent<any>, value: string, reason: AutocompleteInputChangeReason) => {
        setInputvalue(value);
        debounce(value);
    }

    const getTagEvents = (value: string) => {
        console.log(value);
    } 

    return (
        <Autocomplete 
            value={value}
            onChange={handleValueChange}
            inputValue={inputValue}
            onInputChange={handleInputChange}
            options={options}
            renderInput={(params) => <TextField {...params } label="Search event" variant="outlined" />}
        />
    )
}

export default DebounceTextInput;