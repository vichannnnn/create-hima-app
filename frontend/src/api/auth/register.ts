import {apiClient} from "@apiClient";
import {AxiosResponse} from "axios";

export interface RegisterDetails {
    username: string;
    password: string;
    repeat_password: string;
    email: string;
}

export async function register(
    accountDetails: RegisterDetails,
): Promise<AxiosResponse> {
    return await apiClient.post<AxiosResponse>("/user/create", {
        username: accountDetails.username,
        password: accountDetails.password,
        repeat_password: accountDetails.repeat_password,
        email: accountDetails.email,
    });
}
