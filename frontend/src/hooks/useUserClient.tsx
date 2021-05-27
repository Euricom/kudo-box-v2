import { useRef } from "react"
import HttpClient from "../network/HttpClient"
import { useGetAccessToken } from "./useGetAccessToken"
import { MyKudos} from '../pages/MyKudos'

export const useUserClient = () => {
    const { getAccessToken } = useGetAccessToken();
    const httpRef = useRef<HttpClient>(new HttpClient(getAccessToken))

    const getMyKudos = async (): Promise<MyKudos> => {
        const res = await httpRef.current.http.get<MyKudos>('/user/me/kudos')
        return res.data;
    }

    return {
        getMyKudos
    }
}
