import {apiClient} from "@apiClient";
import {LogInDetails, User} from "@providers";
import {AxiosError, AxiosResponse} from "axios";

export async function login(
    formData: LogInDetails,
): Promise<User> {
    try {
        const response: AxiosResponse<User> = await apiClient.post(
            "/user/login",
            formData,
        );
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response && axiosError.response.status === 401) {
            throw axiosError;
        } else if (axiosError.response && axiosError.response.status === 422) {
            throw axiosError;
        }
        throw error;
    }
}
