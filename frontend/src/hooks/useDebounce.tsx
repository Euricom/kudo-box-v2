import { useState } from "react";

interface DebounceActions {
    debouncedFn: (...args: any[]) => void,
    cancelDebounce: () => void
}

const useDebounce = (fn: Function, timeout: number) => {
    const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);

    const cancelDebounce = () => {
        if(timerId) {
            clearTimeout(timerId);
            setTimerId(null);
        }
    }

    const debouncer = (...args: any[]) => {
        if(timerId) clearTimeout(timerId);
        setTimerId(setTimeout(() => { fn.apply(this, args); }, timeout))
    }

    return {
        debouncedFn: debouncer,
        cancelDebounce
    } as DebounceActions;
}

export default useDebounce;