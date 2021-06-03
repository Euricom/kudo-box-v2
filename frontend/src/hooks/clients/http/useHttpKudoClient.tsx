import { useRef } from "react";
import { BasicKudo, DetailedKudo } from "../../../domain";
import HttpClient from "../../../network/HttpClient";
import { useGetAccessToken } from "../useGetAccessToken"
import { useToasts } from 'react-toast-notifications';

export const useHttpKudoClient = () => {
    const { getAccessToken } = useGetAccessToken();
    const httpRef = useRef<HttpClient>(new HttpClient(getAccessToken));
    const { addToast } = useToasts();

    const createKudo = async (imageUrl: string, receiverId?: string, eventId?: string): Promise<void> => {
        const formData = new FormData();
        formData.append('kudoImage', new File([imageUrl], "kudo.webp", {
            type: 'image/webp'
        }));
        if (receiverId) formData.append('receiverId', receiverId);
        if (eventId) formData.append('eventId', eventId);

        try {
            const response = await httpRef.current.http.post<void>('/kudo/create', formData);
            addToast('Kudo Created Successfully', {
                appearance: 'success',
                autoDismiss: true,
                placement: 'top-center'
            });
            return response.data
        } catch (error) {
            addToast('Kudo Creation Failed', {
                appearance: 'error',
                autoDismiss: true,
                placement: 'top-center'
            });
        }
    }

    const getKudos = async (filter?: string): Promise<BasicKudo[]> => {
        const response = await httpRef.current.http.get<BasicKudo[]>(`/kudo/getAll${filter ? `?filter=${filter}` : ''}`);
        return response.data;
    }

    const getKudo = async (id: string): Promise<DetailedKudo> => {
        const response = await httpRef.current.http.get<DetailedKudo>(`/kudo/getOne/${id}`);
        return response.data;
    }

    const deleteKudo = async (id: string): Promise<void> => {
        try {
            const response = await httpRef.current.http.delete<void>(`/kudo/delete/${id}`);
            addToast('Kudo Deleted Successfully', {
                appearance: 'success',
                autoDismiss: true,
                placement: 'top-center'
            });
            return response.data;
        } catch (error) {
            addToast('Kudo Deletion Failed', {
                appearance: 'error',
                autoDismiss: true,
                placement: 'top-center'
            });
        }

    }

    return {
        createKudo,
        getKudos,
        getKudo,
        deleteKudo
    }
}