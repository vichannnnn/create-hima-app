import {ReactNode} from "react";


export interface AuthContextType {
    user: User | null;
    login: (loginDetails: LogInDetails) => Promise<void>;
    logout: () => void;
    registerUserAccount: (formData: RegisterDetails) => Promise<number>;
}

export interface LogInDetails {
    username: string;
    password: string;
}

export interface RegisterDetails {
    username: string;
    password: string;
    repeat_password: string;
    email: string;
}

export interface AuthProviderProps {
    children: ReactNode;
}

export interface User {
    user_id: number;
    username: string;
}
