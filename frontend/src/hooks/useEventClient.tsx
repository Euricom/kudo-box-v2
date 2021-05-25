import { useRef } from "react";
import HttpClient from "../network/HttpClient";
import { useGetAccessToken } from "./useGetAccessToken";
import { TagEvent } from '../pages/NewKudo';

const useEventClient = () => {
    const { getAccessToken } = useGetAccessToken();
    const httpRef = useRef<HttpClient>(new HttpClient(getAccessToken))

    const getEventsWithOwnedTag = async (filterValue: string): Promise<TagEvent[]> => {
        const response = await httpRef.current.http.get<TagEvent[]>(`event/with-owned-tag?event-name=${filterValue}`);
        return response.data;
    }

    return {
        getEventsWithOwnedTag
    }
}

export default useEventClient;