import { useEffect, useState } from "react";
import useSWR from "swr";
import { useGetAccessToken } from './useGetAccessToken';

export function useJwtApiGetCall<T>(cacheEntryName: string, fetcher: (jwt: string) => Promise<T | undefined>): T | undefined {
    const [jwt, setJwt] = useState<string | undefined>(undefined);
    const { data } = useSWR(() => jwt ? [cacheEntryName, jwt] : null, (_url: string, jwt: string) => fetcher(jwt), { initialData: undefined });
    const { getAccessToken } = useGetAccessToken();

    useEffect(() => {
        getJwt();
    }, [])

    const getJwt = async () => {
        setJwt((await getAccessToken()) as string)
    }

    return data;
}