import axiosInstance, { AxiosCustomResponse } from "@/config/axios.config";

export interface HeaderConfigPropsType {
    file?: boolean;
    files?: boolean;
    auth?: boolean;
    params?: {
        page?: number;
        limit?: number;
        search?: null | string
    }

}

abstract class HttpService {
    private headers = {}
    private params = {}
    private setHeaders = (config: HeaderConfigPropsType) => {
        this.headers = {}
        if (config.file || config.files) {
            this.headers = { 'Content-Type': 'multipart/form-data' }
        }
        if (config.auth) {
            this.headers = {
                ...this.headers,
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }
        if (config.params) {
            this.params = config.params
        }
    }

    postRequest = async (url: string, data: any = {}, config: HeaderConfigPropsType = {}) => {
        try {
            this.setHeaders(config)
            const axiosResponse: AxiosCustomResponse = await axiosInstance.post(url, data, {
                headers: this.headers,
            })
            return axiosResponse

        } catch (exception) {
            console.error("Error in postRequest:", exception);
            throw exception;
        }
    }

    getRequest = async (url: string, config: HeaderConfigPropsType) => {
        try {
            this.setHeaders(config)
            const axiosResponse: AxiosCustomResponse = await axiosInstance.get(url, {
                headers: this.headers,
                params: this.params
            })
            return axiosResponse


        } catch (exception) {
            console.error("Error in getRequest:", exception);
            throw exception;
        }
    }
    patchRequest = async (url: string, data: any = {}, config: HeaderConfigPropsType = {}) => {
        try {
            this.setHeaders(config)
            const axiosResponse: AxiosCustomResponse = await axiosInstance.patch(url, data, {
                headers: this.headers
            })
            return axiosResponse

        } catch (exception) {
            console.error("Error in patchRequest:", exception);
            throw exception;
        }
    }
    putRequest = async (url: string, data: any = {}, config: HeaderConfigPropsType = {}) => {
        try {
            this.setHeaders(config)
            const axiosResponse: AxiosCustomResponse = await axiosInstance.put(url, data, {
                headers: this.headers
            })
            return axiosResponse
        } catch (exception) {
            console.error("Error in putRequest:", exception);
            throw exception;
        }
    }
    deleteRequest = async (url: string, config: HeaderConfigPropsType) => {
        try {
            this.setHeaders(config)
            const axiosResponse: AxiosCustomResponse = await axiosInstance.delete(url, {
                headers: this.headers
            })
            return axiosResponse

        } catch (exception) {
            console.error("Error in deleteRequest:", exception);
            throw exception;
        }
    }

}
export default HttpService