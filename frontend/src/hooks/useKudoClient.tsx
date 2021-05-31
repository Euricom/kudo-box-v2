import { useRef } from "react";
import { Kudo, Event } from "../domain";
import HttpClient from "../network/HttpClient";
import { DetailedKudo } from "../pages/KudoDetail/[id]";
import { useGetAccessToken } from "./useGetAccessToken"

const useKudoClient = () => {
    const { getAccessToken } = useGetAccessToken();
    const httpRef = useRef<HttpClient>(new HttpClient(getAccessToken));

    const createKudo = async (imageUrl: string, receiverId: string, eventId?: string): Promise<void> => {
        const formData = new FormData();
        formData.append('kudoImage', new File([imageUrl], "kudo.webp", {
            type: 'image/webp'
        }));
        //temp id's
        formData.append('receiverId', "4e636f54-841d-4967-a6a5-ba922e7235ea");
        if (eventId) formData.append('eventId', eventId);

        const response = await httpRef.current.http.post<void>('/kudo/create', formData);
        return response.data
    }

    const getKudos = async (filter?: string): Promise<Kudo[]>  => {
        const response = await httpRef.current.http.get<Kudo[]>(`/kudo/getAll${filter ? `?filter=${filter}` : ''}`);
        return response.data;
    }

    const getKudo = async (id: string): Promise<DetailedKudo> => {
        const response = await httpRef.current.http.get<DetailedKudo>(`/kudo/getOne/${id}`);
        return response.data;
    }

    const deleteKudo = async (id: string): Promise<void> => {
        const response = await httpRef.current.http.delete<void>(`/kudo/delete/${id}`);
        return response.data;
    }

    const getAllEvents = async (): Promise<Event[]> => {
        const response = await httpRef.current.http.get<Event[]>('/event/getAll');
        return response.data;
    }

    const getFeaturedEvents = async (): Promise<Event[]> => {
        const response = await httpRef.current.http.get<Event[]>('/event/getFeatured');
        return response.data;
    }

    return {
        createKudo,
        getKudos,
        getKudo,
        deleteKudo,
        getAllEvents,
        getFeaturedEvents
    }
}

export default useKudoClient;