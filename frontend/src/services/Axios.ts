import axiosDependency, { AxiosResponse } from 'axios';

const ApiUrl = "http://localhost:3030";
const timeout = 5000;

/**
 * Takes a string, replaces all \ with / and ensures it starts with a /
 *
 * @param {String} url a cleaned up URL
 */
function cleanUrl(url: string) {
    let cleanBase = url.replaceAll('\\', '/');
    if (!url.startsWith('/')) {
        cleanBase = '/' + cleanBase;
    }
    return cleanBase;
}

/**
 * A function that contains the default request config to use for axios
 * see https://github.com/Axios/Axios#request-config
 * @returns an array with the default request config to use for axios
 */
function getBasicRequestParams() {
    return {
        baseURL: ApiUrl,
        timeout: timeout,
        maxContentLength: -1,
        maxBodyLength: -1,
        // headers: {
        //     'http.content_type': 'application/json',
        //     // authorization: vuex.getters.getToken
        // },
        responseEncoding: 'utf8',
        validateStatus: function (status: number) {
            return status >= 200 && status < 300;
        },
        maxRedirects: 10
    };
}

/**
 * Our implementation of axios
 */
export default class axiosImp {
    static async handleRequest<T>(initialProm: Promise<AxiosResponse<T>>, handleOwnError = false) {
        try {
            return await initialProm;
        } catch (error) {
            if (handleOwnError) throw error;
        }
    }
    static async get<T>(url: string, handleOwnError = false) {
        let prom = axiosDependency.get<T>(cleanUrl(url), getBasicRequestParams());
        return this.handleRequest<T>(prom, handleOwnError);
    }
    static async post<T>(url: string, body = {}, handleOwnError = false) {
        let prom = axiosDependency.post<T>(cleanUrl(url), body, getBasicRequestParams());
        return this.handleRequest(prom, handleOwnError);
    }
    static async put<T>(url: string, body = {}, handleOwnError = false) {
        let prom = axiosDependency.put<T>(cleanUrl(url), body, getBasicRequestParams());
        return this.handleRequest(prom, handleOwnError);
    }
    static async delete<T>(url: string, handleOwnError = false) {
        let prom = axiosDependency.delete<T>(cleanUrl(url), getBasicRequestParams());
        return this.handleRequest(prom, handleOwnError);
    }
    static async patch<T>(url: string, body = {}, handleOwnError = false) {
        let prom = axiosDependency.patch<T>(cleanUrl(url), body, getBasicRequestParams());
        return this.handleRequest(prom, handleOwnError);
    }
}
