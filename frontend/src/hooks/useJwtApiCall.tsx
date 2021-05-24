import { InteractionRequiredAuthError, SilentRequest } from "@azure/msal-browser";
import { useAccount, useMsal } from "@azure/msal-react"
import { useEffect, useState } from "react";
import useSWR, { SWRResponse } from "swr";
import { loginRequest } from "../components/AzureAD";

export function useJwtApiCall<T> (fetcher: (jwt: string) => Promise<T | undefined>): T | undefined {
    const { instance, accounts } = useMsal();
    const [jwt, setJwt] = useState<string | undefined>(undefined);
    const { data } = useSWR(() => jwt ? ['/user/me/kudos', jwt] : null, (_url: string, jwt: string) => fetcher(jwt), {initialData: undefined});
    const account = useAccount(accounts[0] || null);

    useEffect(() => {
        getJwt();
    }, []);

    useEffect(() => {
        console.log(jwt)
    }, [jwt])

    const getJwt = async (): Promise<void> => {
        try {
            const silentRequest = {...loginRequest, account} as SilentRequest;
            setJwt((await instance.acquireTokenSilent(silentRequest)).accessToken);
        } catch(e) {
            if(e instanceof InteractionRequiredAuthError) return undefined;
        }
    }

    return data;
}