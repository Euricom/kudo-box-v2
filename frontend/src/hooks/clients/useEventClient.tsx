import { useRef } from "react";
import HttpClient from "../../network/HttpClient";
import { useGetAccessToken } from "./useGetAccessToken";
import { TagEvent } from '../../domain';
import { CreateEventDto, MainEvent } from "../../pages/NewEvent";

export const useEventClient = () => {
    const { getAccessToken } = useGetAccessToken();
    const httpRef = useRef<HttpClient>(new HttpClient(getAccessToken))

    const getEventsWithOwnedTag = async (filterValue: string): Promise<TagEvent[]> => {
        const response = await httpRef.current.http.get<TagEvent[]>(`event/with-owned-tag?event-name=${filterValue}`);
        return response.data;
    }

    const createEvent = async (createEventDto: CreateEventDto): Promise<void> => {
        const formData = new FormData();

        const base64Image = await convertFileBase64(createEventDto.eventImage);
        formData.append('eventImage', base64Image);

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

    const convertFileBase64 = (file: File): Promise<File> => {
        return new Promise((resolve, reject) => {
            const fr = new FileReader();
            fr.onload = (e) => {
                if (!fr.result) return;
                const base64file = new File([fr.result], file.name, {
                    type: file.type
                })

                resolve(base64file);
            }

            fr.onerror = reject;
            fr.readAsDataURL(file);
        })
    }

    return {
        getEventsWithOwnedTag,
        createEvent,
        getMainEvents
    }
}