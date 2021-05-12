import { Autocomplete, AutocompleteChangeReason, AutocompleteInputChangeReason } from "@material-ui/lab";
import axios from '../../services/Axios';
import React, { ChangeEvent, ChangeEventHandler, Dispatch, FC, ReactElement, ReactHTMLElement, ReactNode, SetStateAction, useRef, useState } from "react";
import useDebounce from "../../hooks/useDebounce";
import classes from './DebounceTextInput.module.scss';
import Option from './Option/Option';

export interface EventTag {
    eventId: string;
    eventTitle: string;
    tagName: string;
}

interface Props {
    selectedTag: EventTag | null,
    setSelectedTag: Dispatch<SetStateAction<EventTag | null>>
}

const DebounceTextInput = ({ selectedTag, setSelectedTag }: Props) => {
    const [inputValue, setInputvalue] = useState<string>('');
    const [options, setOptions] = useState<EventTag[]>([]);
    const { debouncedFn, cancelDebounce } = useDebounce((value: string) => getTagEvents(value), 800)

    const handleValueChange = (e: ChangeEvent<any>, value: EventTag | null, reason: AutocompleteChangeReason) => {
        setSelectedTag(value);
    }

    const handleInputChange = (e: ChangeEvent<any>, value: string, reason: AutocompleteInputChangeReason) => {
        setInputvalue(value);
        if (!(!!value)) {
            setOptions([]);
            cancelDebounce();
        }
        else debouncedFn(value);
    }

    const getTagEvents = async (value: string) => {
        const response = (await axios.get<EventTag[]>(`event/with-owned-tag?event-name=${value}`));
        if (!response) return;
        setOptions(response.data);
    }

    return (
        <Autocomplete
            value={selectedTag}
            onChange={handleValueChange}
            inputValue={inputValue}
            onInputChange={handleInputChange}
            options={options}
            getOptionLabel={(option) => option.eventTitle}
            renderOption={(option) => <Option mainText={option.eventTitle} subText={option.tagName} />}
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