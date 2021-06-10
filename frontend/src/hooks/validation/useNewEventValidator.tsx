import { useState } from "react";
import { NewEvent } from '../../pages/NewEvent';

interface EventErrors {
    global: string[];
    title?: string;
    newTagName?: string;
}

const useNewEventValidator = () => {
    const [errors, setErrors] = useState<EventErrors>({ global: [] })

    const validateTitle = (title?: string): string | undefined => {
        if(!title) return 'title can not be empty';

        const trimmedTitle = title.trim();

        if(!trimmedTitle) return 'title can not be empty';
        if(trimmedTitle.length > 20) return 'max 20 characters';
    }

    const validateNewTagName = (newTagName?: string): string | undefined => {
        if(!newTagName) return 'tag can not be empty';

        const trimmedNewTagName = newTagName.trim();

        if(!trimmedNewTagName) return 'tag can not be empty';
        if(trimmedNewTagName.length > 20) return 'max 20 characters';
    }

    const globalValidation = (event: NewEvent): string[] => {
        const globalErrors: string[] = [];

        if(!event.image) globalErrors.push('image upload required');

        return globalErrors;
    }

    const validateNewEvent = (event: NewEvent): boolean => {
        const newErrors: EventErrors = {
            global: globalValidation(event),
            title: validateTitle(event.title),
            newTagName: validateNewTagName(event.newTagName)
        }

        setErrors(newErrors);
        return newErrors.global.length === 0 && !newErrors.title && !newErrors.newTagName;
    }


    return {
        errors,
        validateNewEvent
    }
}

export default useNewEventValidator;