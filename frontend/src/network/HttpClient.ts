import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

export default class HttpClient {
    private _http: AxiosInstance;
    // private _getAccessToken: () => Promise<string | void>;

    constructor(getAccessToken: () => Promise<string | void>) {
        this._http = axios.create({
            baseURL: process.env.API_URL
        });
        
        this._http.interceptors.request.use(async (config: AxiosRequestConfig) => {
            const jwt = await getAccessToken()

            config.headers = {
                Authorization: `Bearer ${jwt}`
            }

            return config;
        });
    }

    get http() {
        return this._http;
    }

}