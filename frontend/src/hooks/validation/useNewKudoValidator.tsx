import { useState } from "react";
import NewKudo from "../../domain/newKudo";

const useNewKudoValidator = () => {
    const [errors, setErrors] = useState<string[]>([]);

    const validateGlobalErrors = (kudo: NewKudo): string[] => {
        const errors: string[] = [];

        const textError = validateKudoText(kudo.text);
        if(textError) errors.push(textError);

        const receiverError = validateReceiver(kudo);
        if(receiverError) errors.push(receiverError);

        setErrors(errors);
        return errors;
    }

    const validateKudoText = (text: string): string | undefined => {
        if(!text) return 'Kudo text can not be empty';

        const trimmedText = text.trim();

        if(trimmedText.length === 0) return 'Kudo text can not be empty'
        if(trimmedText.length > 255) return 'Max text length is 255 characters'

        return undefined;
    }

    const validateReceiver = (kudo: NewKudo): string | undefined => {
        if(!kudo.selectedUser && !kudo.selectedEvent) return 'Both event and receiver can not be empty'
    }

    return {
        errors,
        validateGlobalErrors
    }
}

export default useNewKudoValidator;