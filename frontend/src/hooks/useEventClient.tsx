import { useRef } from "react";
import HttpClient from "../network/HttpClient";
import { useGetAccessToken } from "./useGetAccessToken";
import { TagEvent } from '../pages/NewKudo';
import { CreateEventDto, MainEvent } from "../pages/NewEvent";

const useEventClient = () => {
    const { getAccessToken } = useGetAccessToken();
    const httpRef = useRef<HttpClient>(new HttpClient(getAccessToken))

    const getEventsWithOwnedTag = async (filterValue: string): Promise<TagEvent[]> => {
        const response = await httpRef.current.http.get<TagEvent[]>(`event/with-owned-tag?event-name=${filterValue}`);
        return response.data;
    }

    const createEvent = async (createEventDto: CreateEventDto): Promise<void> => {
        const formData = new FormData();
        formData.append('eventImage', createEventDto.eventImage);
        if (createEventDto.mainEventId) formData.append('mainEventId', createEventDto.mainEventId);
        formData.append('title', createEventDto.title);
        formData.append('isMainEvent', `${createEventDto.isMainEvent}`);
        formData.append('newTagName', createEventDto.newTagName);

        const response = await httpRef.current.http.post<void>('/event/create', formData)

        return response.data;
    }

    const getMainEvents = async (): Promise<MainEvent[]> => {
        const response = await httpRef.current.http.get('/event/main/basic');
        return response.data;
    }

    return {
        getEventsWithOwnedTag,
        createEvent,
        getMainEvents
    }
}

export default useEventClient;