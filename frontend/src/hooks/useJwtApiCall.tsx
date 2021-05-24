import { InteractionRequiredAuthError, SilentRequest } from "@azure/msal-browser";
import { useAccount, useMsal } from "@azure/msal-react"
import { useEffect, useState } from "react";
import useSWR, { SWRResponse } from "swr";
import { loginRequest } from "../components/AzureAD";
import { useGetJwt } from './useGetJwt';

export function useJwtApiGetCall<T> (cacheEntryName: string, fetcher: (jwt: string) => Promise<T | undefined>): T | undefined {
    const [jwt, setJwt] = useState<string | undefined>(undefined);
    const { data } = useSWR(() => jwt ? [cacheEntryName, jwt] : null, (_url: string, jwt: string) => fetcher(jwt), {initialData: undefined});
    const getJwtFn = useGetJwt();

    useEffect(() => {
        getJwt();
    }, [])

    const getJwt = async () => {
        setJwt(await getJwtFn())
    }

    return data;
}