import { useState } from "react";

const useDebounce = (fn: Function, timeout: number) => {
    const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);

    return (...args: any[]) => {
        if(timerId) clearTimeout(timerId);
        setTimerId(setTimeout(() => { fn.apply(this, args); }, timeout))
    }
}

export default useDebounce;