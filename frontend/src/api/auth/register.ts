import {apiClient} from "@apiClient";
import {AxiosResponse} from "axios";
import {RegisterDetails} from "@providers";


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
