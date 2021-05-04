import axiosDependency from 'axios';

const ApiUrl = "http://localhost:3030";
const timeout = 5000;

/**
 * Takes a string, replaces all \ with / and ensures it starts with a /
 *
 * @param {String} url a cleaned up URL
 */
function cleanUrl(url) {
    if (typeof url !== 'string') {
        url = url.toString();
    }

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
        validateStatus: function (status) {
            return status >= 200 && status < 300;
        },
        maxRedirects: 10
    };
}

/**
 * Our implementation of axios
 */
export default class axiosImp {
    static async handleRequest(initialProm, handleOwnError = false) {
        try {
            return await initialProm;
        } catch (error) {
            if (handleOwnError) throw error;
        }
    }
    static async get(url, handleOwnError = false) {
        let prom = axiosDependency.get(cleanUrl(url), getBasicRequestParams());
        return this.handleRequest(prom, handleOwnError);
    }
    static async post(url, body = {}, handleOwnError = false) {
        let prom = axiosDependency.post(cleanUrl(url), body, getBasicRequestParams());
        return this.handleRequest(prom, handleOwnError);
    }
    static async put(url, body = {}, handleOwnError = false) {
        let prom = axiosDependency.put(cleanUrl(url), body, getBasicRequestParams());
        return this.handleRequest(prom, handleOwnError);
    }
    static async delete(url, handleOwnError = false) {
        let prom = axiosDependency.delete(cleanUrl(url), getBasicRequestParams());
        return this.handleRequest(prom, handleOwnError);
    }
    static async patch(url, body = {}, handleOwnError = false) {
        let prom = axiosDependency.patch(cleanUrl(url), body, getBasicRequestParams());
        return this.handleRequest(prom, handleOwnError);
    }
}
