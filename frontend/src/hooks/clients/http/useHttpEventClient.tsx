import { useRef } from "react";
import HttpClient from "../../../network/HttpClient";
import { useGetAccessToken } from "../useGetAccessToken";
import { TagEvent } from '../../../domain';
import { CreateEventDto, MainEvent } from "../../../pages/NewEvent";
import { useToasts } from 'react-toast-notifications';
import { Event } from '../../../domain'

export const useHttpEventClient = () => {
    const { getAccessToken } = useGetAccessToken();
    const httpRef = useRef<HttpClient>(new HttpClient(getAccessToken))
    const { addToast } = useToasts();

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

        try {
            const response = await httpRef.current.http.post<void>('/event/create', formData)
            addToast('Event Created Successfully', {
                appearance: 'success',
                autoDismiss: true,
                placement: 'top-center'
            });
            return response.data
        } catch (error) {
            addToast('Event Creation Failed', {
                appearance: 'error',
                autoDismiss: true,
                placement: 'top-center'
            });
        }
    }

    const getMainEvents = async (): Promise<MainEvent[]> => {
        const response = await httpRef.current.http.get('/event/main/basic');
        return response.data;
    }

    const getWsEventRoomUrl = async (): Promise<string> => {
        const response = await httpRef.current.http.get<string>('/event/event-room-url');
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

    const getAllEvents = async (filter?: string): Promise<Event[]> => {
        const response = await httpRef.current.http.get<Event[]>(`/event/getAll${filter ? `?filter=${filter}` : ''}`);
        return response.data;
    }

    const getFeaturedEvents = async (): Promise<Event[]> => {
        const response = await httpRef.current.http.get<Event[]>('/event/getFeatured');
        return response.data;
    }

    const toggleActive = async (id: string) => {
        try {
            await httpRef.current.http.post(`/event/toggleActive?eventId=${id}`);
            addToast('Event Toggled Successfully', {
                appearance: 'success',
                autoDismiss: true,
                placement: 'top-center'
            });
        } catch (error) {
            addToast('Event Toggle Failed', {
                appearance: 'error',
                autoDismiss: true,
                placement: 'top-center'
            });
        }
    }

    return {
        getEventsWithOwnedTag,
        createEvent,
        getMainEvents,
        getWsEventRoomUrl,
        getAllEvents,
        getFeaturedEvents,
        toggleActive
    }
}