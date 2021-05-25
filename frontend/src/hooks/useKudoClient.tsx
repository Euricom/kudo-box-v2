import { useRef } from "react";
import HttpClient from "../network/HttpClient";
import { useGetAccessToken } from "./useGetAccessToken"

const useKudoClient = () => {
    const {getAccessToken} = useGetAccessToken();
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

    return {
        createKudo
    }
}

export default useKudoClient;