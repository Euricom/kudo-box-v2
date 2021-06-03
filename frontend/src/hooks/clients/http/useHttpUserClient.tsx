import { useRef } from "react"
import HttpClient from "../../../network/HttpClient"
import { useGetAccessToken } from "../useGetAccessToken"
import { MyKudos } from '../../../pages/MyKudos'
import { User } from '../../../domain'

export const useHttpUserClient = () => {
    const { getAccessToken } = useGetAccessToken();
    const httpRef = useRef<HttpClient>(new HttpClient(getAccessToken))

    const getMyKudos = async (): Promise<MyKudos> => {
        const res = await httpRef.current.http.get<MyKudos>('/user/me/kudos')
        return res.data;
    }

    const getUserByName = async (filterValue: string): Promise<User[]> => {
        const response = await httpRef.current.http.get<User[]>(`user/getByName?name=${filterValue}`);
        return response.data;
    }

    return {
        getMyKudos,
        getUserByName
    }
}
