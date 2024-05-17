import {apiClient} from "@apiClient";
import {User} from "@providers";
import axios from "axios";

export async function getUser(): Promise<User | null> {
    try {
        const response = await apiClient.get<User>("/user/get");
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            return null;
        }
        throw error;
    }
}